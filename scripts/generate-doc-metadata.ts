import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import type { ComponentMeta, PropMeta } from "@repo/docs-schema";

const args = new Set(process.argv.slice(2));
const target = args.has("--target") ? process.argv[process.argv.indexOf("--target") + 1] : undefined;

if (target !== "daisy-ui") {
  throw new Error("Only --target daisy-ui is supported in the initial scaffold.");
}

const scriptDir = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const srcDir = path.join(rootDir, "packages/daisy-ui/src");
const outDir = path.join(rootDir, "apps/daisy-ui-docs/src/content/meta");

// Extract description from file JSDoc comment
function extractFileDescription(content: string, fallback: string): string {
  const match = content.match(/\/\*\*\s*\n\s*\*\s*([^*\n]+)\n\s*\*\//);
  return match?.[1]?.trim() ?? fallback;
}

// Extract enum values and defaults from CVA variant definition
interface VariantInfo {
  variants: Record<string, string[]>;
  defaults: Record<string, string>;
  descriptions: Record<string, string>;
}

function extractCvaInfo(content: string): VariantInfo {
  const info = {
    variants: {} as Record<string, string[]>,
    defaults: {} as Record<string, string>,
    descriptions: {} as Record<string, string>,
  };

  // Extract defaultVariants block
  const defaultsMatch = content.match(/defaultVariants:\s*\{([^}]+)}/);
  if (defaultsMatch) {
    const defaultsBlock = defaultsMatch[1];
    for (const line of defaultsBlock.split("\n")) {
      const match = line.match(/(\w+):\s*([^,}]+)/);
      if (match) {
        const key = match[1];
        info.defaults[key] = match[2]
          .trim()
          .replace(/[\s,]/g, "")
          .replace(/^['"]|['"]$/g, "");
      }
    }
  }

  // Extract variants block - find all variant properties
  const variantsMatch = content.match(/variants:\s*\{([\s\S]+?)\n\s*}\s*}/);
  if (variantsMatch) {
    const variantsBlock = variantsMatch[1];

    // Capture leading comments for each top-level variant key.
    const lines = variantsBlock.split("\n");
    let pendingCommentLines: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("//")) {
        pendingCommentLines.push(trimmed.replace(/^\/\/\s*/, "").trim());
        continue;
      }
      if (!trimmed) {
        continue;
      }

      const variantDecl = trimmed.match(/^(\w+):\s*\{$/);
      if (variantDecl && pendingCommentLines.length > 0) {
        info.descriptions[variantDecl[1]] = pendingCommentLines.join(" ").replace(/\s+/g, " ").trim();
      }
      pendingCommentLines = [];
    }

    // Split by variant property name
    const variantPattern = /(\w+):\s*\{([^}]+)}/g;
    let m;
    while ((m = variantPattern.exec(variantsBlock)) !== null) {
      const variantName = m[1];
      const variantValues = m[2];

      // Extract all keys from the variant (ignore "null" values and comments)
      const keys = [];
      const keyPattern = /(\w+):\s*(?!"[^"]*"null)/g;
      let km;
      while ((km = keyPattern.exec(variantValues)) !== null) {
        keys.push(km[1]);
      }
      if (keys.length > 0) {
        info.variants[variantName] = keys;
      }
    }
  }

  return info;
}

// Extract types from prop interface comments
interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

function extractPropsFromInterface(content: string, interfaceName: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Find the interface/type definition - more robust pattern for multiline
  const interfaceRegex = new RegExp(
    `type\\s+${interfaceName}\\s*=\\s*\\{([\\s\\S]*?)\\n}|interface\\s+${interfaceName}\\s*\\{([\\s\\S]*?)\\n}`,
  );
  const match = content.match(interfaceRegex);

  if (!match) {
    return props;
  }

  const blockContent = match[1] || match[2];
  const lines = blockContent.split("\n");

  let currentComment = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Collect comment lines (everything before the property definition)
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) {
      currentComment =
        trimmed
          .replace(/^\/\/\s*/, "")
          .replace(/^\*\s*/, "")
          .trim() || currentComment;
      continue;
    }

    // Skip empty lines
    if (!trimmed) {
      continue;
    }

    // Look for property definition: name?: type; or name: type;
    const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+?)[;,]?\s*$/);
    if (propMatch) {
      const propName = propMatch[1];
      const isOptional = Boolean(propMatch[2]);
      let typeStr = propMatch[3].trim();

      // Remove trailing semicolon/comma
      typeStr = typeStr.replace(/[;,]\s*$/, "").trim();

      props.push({
        name: propName,
        type: typeStr,
        required: !isOptional,
        description: currentComment || `${propName} prop`,
      });

      currentComment = "";
    }
  }

  return props;
}

async function extractComponentMeta(componentName: string, filePath: string): Promise<ComponentMeta> {
  const sourceContent = await fs.readFile(filePath, "utf8");

  // Extract top file description
  const desc = extractFileDescription(sourceContent, `${componentName} component`);

  const props: PropMeta[] = [];

  // Extract CVA variants if present
  const cvaInfo = extractCvaInfo(sourceContent);
  for (const [variantName, values] of Object.entries(cvaInfo.variants)) {
    const defaultValue = cvaInfo.defaults[variantName];
    const typeStr = values.map((v) => `"${v}"`).join(" | ");
    const variantDescription = cvaInfo.descriptions[variantName] ?? `Controls ${variantName} variant.`;

    props.push({
      name: variantName,
      type: typeStr,
      required: false,
      default: defaultValue,
      description: variantDescription,
      enumValues: values,
    });
  }

  // Extract extra props from interfaces (e.g., InputExtraProps, ButtonExtraProps)
  const extraInterfaceName = `${componentName}ExtraProps`;
  const extraProps = extractPropsFromInterface(sourceContent, extraInterfaceName);
  for (const prop of extraProps) {
    // Skip if already added from CVA
    if (!props.find((p) => p.name === prop.name)) {
      props.push({
        name: prop.name,
        type: prop.type,
        required: prop.required,
        description: prop.description,
      });
    }
  }

  return {
    component: componentName,
    package: "@repo/daisy-ui",
    description: desc,
    props,
    examples: [],
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const components = ["Button", "Input", "Modal"];

  for (const name of components) {
    const fileName = `${name}.tsx`;
    const filePath = path.join(srcDir, fileName);

    try {
      const meta = await extractComponentMeta(name, filePath);
      const outFile = path.join(outDir, `${name.toLowerCase()}.json`);
      await fs.writeFile(outFile, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
      // eslint-disable-next-line no-console
      console.log(`✓ Generated metadata for ${name} from ${fileName}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`✗ Failed to extract ${name}:`, (err as Error).message);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`\nMetadata generation complete in ${outDir}`);
}

void main();

