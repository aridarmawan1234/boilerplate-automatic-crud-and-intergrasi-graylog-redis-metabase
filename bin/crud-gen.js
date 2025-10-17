#!/usr/bin/env node
/**
 * CRUD CLI generator - single-file template creator
 * Usage examples (from terminal):
 *   node crud-cli-generator.js Post title:string body:string published:boolean --output post.crud.js
 *   ./crud-cli-generator.js User id:number name:string email:string --output user.crud.js
 *
 * What it generates: a single JavaScript file exporting an Express Router
 * that implements in-memory CRUD (list, get, create, update, delete) plus
 * a simple model-like structure derived from fields provided.
 *
 * Notes:
 * - No external dependencies required to run the generator itself (Node.js >= 14)
 * - The generated file depends only on express (for the router). For quick testing
 *   you can mount the router in an express app.
 *
 * Installation (optional):
 *   chmod +x crud-cli-generator.js
 *   npm link        # to link globally from this folder, then run `crud-gen` if you add a bin entry
 *
 * Example generated file usage (in an Express app):
 *   const express = require('express');
 *   const app = express();
 *   app.use(express.json());
 *   const userRouter = require('./user.crud.js');
 *   app.use('/users', userRouter);
 *   app.listen(3000);
 */

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  // argv expected: [node, script, EntityName, field:type, field2:type2, ..., --output, filename]
  const args = argv.slice(2);
  if (args.length === 0) return null;

  const outIndex = args.indexOf("--output");
  let output = null;
  if (outIndex !== -1) {
    output = args[outIndex + 1];
    args.splice(outIndex, 2);
  }

  const entity = args[0];
  const fields = [];
  for (let i = 1; i < args.length; i++) {
    const token = args[i];
    if (!token) continue;
    const [name, type] = token.split(":");
    fields.push({ name, type: type || "string" });
  }

  return { entity, fields, output };
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateFileContent(entity, fields) {
  const Entity = toPascalCase(entity);     // misal: User
  const entityVar = toCamelCase(entity);   // misal: user

  return `const express = require('express');
const app = express();

/**
 * Generated CRUD for ${Entity}
 * Fields: ${fields.map(f => `${f.name}:${f.type}`).join(", ")}
 * In-memory store for quick prototype
 */
let ${entityVar}Store = [];
let ${entityVar}NextId = 1;

// CREATE
exports.create${Entity} = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const payload = req.body || {};
        const newItem = {
            id: ${entityVar}NextId++,
${fields
  .filter(f => f.name !== "id")
  .map(f => `            ${f.name}: payload.${f.name} || null`)
  .join(",\n")}
        };
        ${entityVar}Store.push(newItem);
        response.code = 201;
        response.data = newItem;
        response.message = '${Entity} created';
        return res.status(201).json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// READ ALL
exports.getAll${Entity} = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        response.code = 200;
        response.data = ${entityVar}Store;
        response.message = 'List of ${Entity}';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// READ ONE
exports.get${Entity}ById = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const item = ${entityVar}Store.find(x => x.id === id);
        if (!item) {
            response.code = 404;
            response.message = '${Entity} not found';
            return res.status(404).json(response);
        }
        response.code = 200;
        response.data = item;
        response.message = '${Entity} found';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// UPDATE
exports.update${Entity} = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const payload = req.body || {};
        const item = ${entityVar}Store.find(x => x.id === id);
        if (!item) {
            response.code = 404;
            response.message = '${Entity} not found';
            return res.status(404).json(response);
        }

${fields
  .filter(f => f.name !== "id")
  .map(f => `        if (payload.${f.name} !== undefined) item.${f.name} = payload.${f.name};`)
  .join("\n")}

        response.code = 200;
        response.data = item;
        response.message = '${Entity} updated';
        return res.json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};

// DELETE
exports.delete${Entity} = async (req, res) => {
    let response = { data: null, message: '', code: 500 };
    try {
        const id = Number(req.params.id);
        const before = ${entityVar}Store.length;
        ${entityVar}Store = ${entityVar}Store.filter(x => x.id !== id);
        if (${entityVar}Store.length === before) {
            response.code = 404;
            response.message = '${Entity} not found';
            return res.status(404).json(response);
        }
        response.code = 204;
        response.message = '${Entity} deleted';
        return res.status(204).json(response);
    } catch (error) {
        response.code = 500;
        response.message = error.message;
        return res.status(500).json(response);
    }
};
`;
}

function kebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function updateRoutesFile(entity, outputFile) {
  const routesFile = path.resolve(process.cwd(), "routes.js");
  const entityVar = toCamelCase(entity);
  const routePath = "/" + entity.toLowerCase() + "s"; // contoh: User -> /users

  let importLine = `const ${entityVar}Router = require('./api/${path.basename(
    outputFile
  )}');\n`;
  let useLine = `app.post('${routePath}', ${entityVar}Router.create${toPascalCase(entity)});\napp.get('${routePath}/:id', ${entityVar}Router.get${toPascalCase(entity)}ById);\napp.get('${routePath}', ${entityVar}Router.getAll${toPascalCase(entity)});\napp.put('${routePath}/:id', ${entityVar}Router.update${toPascalCase(entity)});\napp.delete('${routePath}/:id', ${entityVar}Router.delete${toPascalCase(entity)});\n`;

  let content;
  if (fs.existsSync(routesFile)) {
    // kalau file sudah ada → append kalau belum ada
    content = fs.readFileSync(routesFile, "utf8");
    if (!content.includes(importLine)) {
      const lines = content.split("\n");

      // Sisipkan sebelum module.exports atau akhir file
      const insertIndex =
        lines.findIndex((l) => l.includes("module.exports")) || lines.length;
      lines.splice(insertIndex, 0, importLine + useLine);
      content = lines.join("\n");
    }
  } else {
    // kalau belum ada → buat baru
    content = `const express = require('express');\nconst app = express.Router();\n\n${importLine}\n${useLine}\n\nmodule.exports = app;\n`;
  }

  fs.writeFileSync(routesFile, content, "utf8");
  console.log(`Updated routes file: ${routesFile}`);
}

function main() {
  const parsed = parseArgs(process.argv);
  if (!parsed || !parsed.entity) {
    console.log(
      "Usage: node crud-cli-generator.js EntityName field:type field2:type2 --output filename"
    );
    console.log(
      "Example: node crud-cli-generator.js User id:number name:string email:string --output user.crud.js"
    );
    process.exit(1);
  }

  const entity = parsed.entity;
  const fields = parsed.fields;
  const output = parsed.output || `${kebabCase(entity)}.js`;
  console.log(entity, fields);
  const content = generateFileContent(entity, fields);

  const outPath = path.resolve(process.cwd(), `api/${output}`);
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`Generated CRUD file: ${outPath}`);
  updateRoutesFile(entity, output);
}

if (require.main === module) main();
