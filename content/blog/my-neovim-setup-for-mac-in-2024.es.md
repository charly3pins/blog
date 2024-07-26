+++
title = "Mi configuración de Neovim para Mac en 2024"
date = "2024-07-26"
author = "charly3pins"
description = "Ten en tu terminal un IDE completo, totalmente personalizable y siendo una bestia de la productividad con su increíble ecosistema de plugins."

tags = ["terminal", "neovim", "vim"]

image = ""

+++

## Introducción

No voy a mentir, he intentado saltar de mi editor a Vim muchas veces desde que usaba Eclipse, luego Sublime y el último VS Code.
Siempre me ha fascinado Vim y su potencial. ¿Cómo algo tan simple puede ser tan poderoso? La realidad es que abrí varias veces Vimtutor y me quedé atascado.
Intenté editar el texto en Vim y me quedé atascado. Intenté codificar algo y me quedé atascado. El año pasado lo intenté en serio y pasé una o dos semanas solo usando Vim.
Pensé que era el momento, pero fallé... otra vez. En el segundo trimestre de este año decidí tomarme eso en serio. Leí muchas publicaciones, miré algunos videos de YouTube y también leí
[Mastering Vim Quickly: From WTF to OMG in no time](https://amzn.to/3Jaiqu0) de _Jovica Ilic_. ¡Ahora sí! Estoy usando Vim para casi todo. A veces tengo que admitir
que todavía uso VS Code para tareas que requieren editar muchas líneas al mismo tiempo y que todavía no soy tan bueno con Vim, pero muy poco.

Así que hoy les voy a mostrar mi configuración de Neovim y todos los plugins que uso todos los días, principalmente mientras programo.

## Requisitos

Estoy usando MacOS y uso brew para administrar mis dependencias, así que supongo que tú también lo harás. Si no, instálalo yendo a su [sitio web oficial](https://brew.sh/) y siguiendo las instrucciones.

No es obligatorio, pero para los interesados, estoy usando la [terminal Alacritty](https://github.com/alacritty/alacritty), así que si estás interesado, puedes descargarlo usando el siguiente comando en tu terminal:

```sh
brew install --cask alacritty
```

Creo que publicaré una entrada en el futuro en la que explique todas las configuraciones de mi terminal, pero volvamos a nuestra configuración de Neovim.

Para instalar Neovim, simplemente escriba lo siguiente en su terminal:

```sh
brew install Neovim
```

## Estructura de ficheros

A partir de ahora veremos la configuración de Neovim. Puedes encontrar el código completo en mis [dotfiles](https://github.com/charly3pins/dotfiles/tree/main/editors/nvim). Siéntete libre de clonar el repositorio y manipularlo como quieras.

La configuración se almacenará en `~/.config/nvim`. En mi caso, tengo un enlace simbólico a mi repositorio de dotfiles, como probablemente hayas notado si revisaste el repositorio, no es necesario.

Si aún no tienes la carpeta creada, puedes hacerlo ejecutando:

```sh
mkdir -p ~/.config/nvim
```

y luego entra a ese directorio:

```sh
cd ~/.config/nvim
```

y crea el archivo principal para tu configuración usando lua como:

```sh
touch init.lua
```

Además del archivo principal, voy a crear dos carpetas, una para la configuración principal y otra para la configuración de los plugins; y un archivo lazy.lua para administrar la configuración del administrador de plugins [lazy.nvim](https://github.com/folke/lazy.nvim).

```sh
mkdir -p lua/charly3pins/core
```

```sh
mkdir -p lua/charly3pins/plugins
```

```sh
touch lua/charly3pins/lazy.lua
```

Reemplaza `charly3pins` con tu nombre de usuario.

## Opciones básicas

Para las opciones principales, tengo 3 archivos con diferentes configuraciones en cada uno y 1 que agrupa las 3. En primer lugar, muévete al directorio principal.

```sh
cd lua/charly3pins/core
```

Y luego crea los 4 archivos de la siguiente manera:

```sh
touch autocommands.lua
```

```sh
touch init.lua
```

```sh
touch keymaps.lua
```

```sh
touch options.lua
```

En `autocommands` tengo el siguiente código:

```nvim
-- Highlight when yanking (copying) text
--  Try it with `yap` in normal mode
--  See `:help vim.highlight.on_yank()`
vim.api.nvim_create_autocmd("TextYankPost", {
	desc = "Highlight when yanking (copying) text",
	group = vim.api.nvim_create_augroup("kickstart-highlight-yank", { clear = true }),
	callback = function()
		vim.highlight.on_yank()
	end,
})
```

Esto se utiliza cuando se extrae texto para resaltar lo que se extrae.

Los `keymaps` son donde defino todos mis atajos. Uso el espacio como líder, como disparador y la configuración de los diferentes plugins:

```nvim
vim.g.mapleader = " "

local keymap = vim.keymap

-- use jk to exit insert mode
keymap.set("i", "jk", "<ESC>", { desc = "Exit insert mode with jk" })

-- clear search highlights
keymap.set("n", "<leader>nh", ":nohl<CR>", { desc = "Clear search highlights" })

-- delete single character without copying into register
-- keymap.set("n", "x", '"_x')

-- increment/decrement numbers
keymap.set("n", "<leader>+", "<C-a>", { desc = "Increment number" }) -- increment
keymap.set("n", "<leader>-", "<C-x>", { desc = "Decrement number" }) -- decrement

-- window management
keymap.set("n", "<leader>sv", "<C-w>v", { desc = "Split window vertically" }) -- split window vertically
keymap.set("n", "<leader>sh", "<C-w>s", { desc = "Split window horizontally" }) -- split window horizontally
keymap.set("n", "<leader>se", "<C-w>=", { desc = "Make splits equal size" }) -- make split windows equal width & height
keymap.set("n", "<leader>sq", "<cmd>close<CR>", { desc = "Close current split" }) -- close current split window

keymap.set("n", "<leader>to", "<cmd>tabnew<CR>", { desc = "Open new tab" }) -- open new tab
keymap.set("n", "<leader>tq", "<cmd>tabclose<CR>", { desc = "Close current tab" }) -- close current tab
keymap.set("n", "<leader>tn", "<cmd>tabn<CR>", { desc = "Go to next tab" }) --  go to next tab
keymap.set("n", "<leader>tp", "<cmd>tabp<CR>", { desc = "Go to previous tab" }) --  go to previous tab
keymap.set("n", "<leader>tf", "<cmd>tabnew %<CR>", { desc = "Open current buffer in new tab" }) --  move current buffer to new tab

-- Disable arrow keys in normal mode
vim.keymap.set("n", "<left>", '<cmd>echo "Use h to move!!"<CR>')
vim.keymap.set("n", "<right>", '<cmd>echo "Use l to move!!"<CR>')
vim.keymap.set("n", "<up>", '<cmd>echo "Use k to move!!"<CR>')
vim.keymap.set("n", "<down>", '<cmd>echo "Use j to move!!"<CR>')
```

En `options` están las opciones de vim para las funcionalidades básicas del editor:

```nvim
vim.cmd("let g:netrw_liststyle = 3")

local opt = vim.opt

-- line numbers
opt.relativenumber = true
opt.number = true

-- tabs & indentation
opt.tabstop = 2 -- 2 spaces for tabs
opt.shiftwidth = 2 -- 2 spaces for indent width
opt.expandtab = true -- expand tab to spaces
opt.autoindent = true -- copy indent from current line when starting new one

-- line wrapping
opt.wrap = false -- disable line wrapping

-- search settings
opt.ignorecase = true -- ignore case when searching
opt.smartcase = true -- if you include mixed case in your search, assumes you want case-sensitive

-- cursor line
opt.cursorline = true -- highlight the current cursor line

-- appearance

-- turn on termguicolors for nightfly colorscheme to work
-- (have to use iterm2 or any other true color terminal)
opt.termguicolors = true
opt.background = "dark" -- colorschemes that can be light or dark will be made dark
opt.signcolumn = "yes" -- show sign column so that text doesn't shift

-- backspace
opt.backspace = "indent,eol,start" -- allow backspace on indent, end of line or insert mode start position

-- clipboard
opt.clipboard:append("unnamedplus") -- use system clipboard as default register

-- split windows
opt.splitright = true -- split vertical window to the right
opt.splitbelow = true -- split horizontal window to the bottom
```

Por último, el archivo init es donde los agrupo todos, ya que lua ejecutará el init primero para cada directorio, por lo que el contenido es simplemente este:

```nvim
require("charly3pins.core.options")
require("charly3pins.core.keymaps")
require("charly3pins.core.autocommands")
```

## Lazy config

Como dije, uso lazy.nvim como administrador de plugins para Neovim, por lo que el siguiente paso es subir un directorio y editar nuestro archivo `lazy.lua` para agregar lo siguiente:

```nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({ { import = "charly3pins.plugins" }, { import = "charly3pins.plugins.lsp" } }, {
	change_detection = {
		notify = false,
	}
})
```

Para obtener más detalles, puede encontrar la documentación en la [página de GitHub](https://github.com/folke/lazy.nvim).

## Envuelva la configuración inicial

Una vez que tenga los archivos de configuración principales en su lugar y la configuración de lazy.nvim, hay un paso más que debe realizar antes de poder comenzar a experimentar con los plugins.

Vaya a la carpeta raíz:

```
cd ~/.config/nvim
```

y edite su archivo `init.lua` y agregue lo siguiente:

```nvim
require("charly3pins.core")
require("charly3pins.lazy")
```

Ahora solo tienes que reiniciar la terminal y, si abres de nuevo tu Neovim, podrás escribir `:Lazy` y ver el plugin funcionando.

La estructura de tu carpeta debería verse así:

```
  lua
    charly3pins
      core
    │ │  autocommands.lua
    │ │  init.lua
    │ │  keymaps.lua
    │ └  options.lua
      plugins
    └  lazy.lua
   init.lua
```

## Mis plugins

Aquí compartiré la lista de todos los plugins que uso y su configuración. Para obtener más detalles, consulte cada documentación o hágame una pregunta a continuación.

Cada plugin debe tener un archivo con su nombre (el título en cada sección) .lua, como `alpha.lua`.

### alpha

Un saludo con tecnología lua.

```nvim
return {
  "goolord/alpha-nvim",
  event = "VimEnter",
  config = function()
    local alpha = require("alpha")
    local dashboard = require("alpha.themes.dashboard")

    -- Set header
    dashboard.section.header.val = {
      "                                                     ",
      "  ███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗███╗   ███╗ ",
      "  ████╗  ██║██╔════╝██╔═══██╗██║   ██║██║████╗ ████║ ",
      "  ██╔██╗ ██║█████╗  ██║   ██║██║   ██║██║██╔████╔██║ ",
      "  ██║╚██╗██║██╔══╝  ██║   ██║╚██╗ ██╔╝██║██║╚██╔╝██║ ",
      "  ██║ ╚████║███████╗╚██████╔╝ ╚████╔╝ ██║██║ ╚═╝ ██║ ",
      "  ╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═══╝  ╚═╝╚═╝     ╚═╝ ",
      "                                                     ",
    }

    -- Set menu
    dashboard.section.buttons.val = {
      dashboard.button("e", "  > New File", "<cmd>ene<CR>"),
      dashboard.button("SPC ee", "  > Toggle file explorer", "<cmd>NvimTreeToggle<CR>"),
      dashboard.button("SPC ff", "󰱼 > Find File", "<cmd>Telescope find_files<CR>"),
      dashboard.button("SPC fs", "  > Find Word", "<cmd>Telescope live_grep<CR>"),
      dashboard.button("SPC wr", "󰁯  > Restore Session For Current Directory", "<cmd>SessionRestore<CR>"),
      dashboard.button("q", " > Quit NVIM", "<cmd>qa<CR>"),
    }

    -- Send config to alpha
    alpha.setup(dashboard.opts)

    -- Disable folding on alpha buffer
    vim.cmd([[autocmd FileType alpha setlocal nofoldenable]])
  end,
}
```

### auto-session

Un pequeño administrador de sesiones automatizado para Neovim.

```nvim
return {
  "rmagatti/auto-session",
  config = function()
    local auto_session = require("auto-session")

    auto_session.setup({
      auto_restore_enabled = false,
      auto_session_suppress_dirs = { "~/", "~/Dev/", "~/Downloads", "~/Documents", "~/Desktop/" },
    })

    local keymap = vim.keymap

    keymap.set("n", "<leader>wr", "<cmd>SessionRestore<CR>", { desc = "Restore session for cwd" }) -- restore last workspace session for current directory
    keymap.set("n", "<leader>ws", "<cmd>SessionSave<CR>", { desc = "Save session for auto session root dir" }) -- save workspace session for current working directory
  end,
}
```

### bufferline

Una elegante bufferline.

```nvim
return {
  "akinsho/bufferline.nvim",
  dependencies = { "nvim-tree/nvim-web-devicons" },
  version = "*",
  opts = {
    options = {
      mode = "tabs",
      separator_style = "slant",
    },
  },
}
```

### colorscheme

Esquema de colores para Neovim.
Llevo mucho tiempo usando la gruvbox pero hace unas semanas descubrí la de craftzdog y todavía la sigo usando, así que compartiré estas dos más la tokyonight construida por el único folke.

```nvim
-- return {
-- 	"ellisonleao/gruvbox.nvim",
-- 	priority = 1000, -- make sure to load this before all the other start plugins
-- 	config = function()
-- 		vim.cmd("colorscheme gruvbox")
-- 	end,
-- }
-- return {
-- 	"folke/tokyonight.nvim",
-- 	priority = 1000, -- Make sure to load this before all the other start plugins.
-- 	init = function()
-- 		-- Load the colorscheme here.
-- 		-- Like many other themes, this one has different styles, and you could load
-- 		-- any other, such as 'tokyonight-storm', 'tokyonight-moon', or 'tokyonight-day'.
-- 		vim.cmd.colorscheme("tokyonight-night")
-- 	end,
-- }
return {
	"craftzdog/solarized-osaka.nvim",
	lazy = false,
	priority = 1000,
	opts = {},
	config = function()
		vim.cmd("colorscheme solarized-osaka")
	end,
}
```

### comment

Plugin de comentarios para Neovim.

```nvim
return {
  "numToStr/Comment.nvim",
  event = { "BufReadPre", "BufNewFile" },
  dependencies = {
    "JoosepAlviste/nvim-ts-context-commentstring",
  },
  config = function()
    -- import comment plugin safely
    local comment = require("Comment")

    local ts_context_commentstring = require("ts_context_commentstring.integrations.comment_nvim")

    -- enable comment
    comment.setup({
      -- for commenting tsx, jsx, svelte, html files
      pre_hook = ts_context_commentstring.create_pre_hook(),
    })
  end,
}
```

### dressing

Plugin de Neovim para mejorar las interfaces predeterminadas de vim.ui.

```nvim
return {
  "stevearc/dressing.nvim",
  event = "VeryLazy",
}
```

### formatting

Plugin formateador ligero pero potente para Neovim.

Aquí tengo la configuración para mis lenguajes de programación más utilizados, como Go, Python y desarrollo web. También para los archivos de configuración como JSON y YAML y mi escritura en Markdown.

```nvim
return {
	"stevearc/conform.nvim",
	event = { "BufReadPre", "BufNewFile" },
	config = function()
		local conform = require("conform")

		conform.setup({
			formatters_by_ft = {
				css = { "prettier" },
				html = { "prettier" },
				json = { "prettier" },
				yaml = { "prettier" },
				markdown = { "prettier" },
				lua = { "stylua" },
				python = { "isort", "black" },
				go = { "goimports", "gofmt" },
			},
			format_on_save = {
				lsp_fallback = true,
				async = false,
				timeout_ms = 1000,
			},
		})

		vim.keymap.set({ "n", "v" }, "<leader>cp", function()
			conform.format({
				lsp_fallback = true,
				async = false,
				timeout_ms = 1000,
			})
		end, { desc = "Format file or range (in visual mode)" })
	end,
}
```

### gitsigns

Integración de Git para buffers.

```nvim
return {
  "lewis6991/gitsigns.nvim",
  event = { "BufReadPre", "BufNewFile" },
  opts = {
    on_attach = function(bufnr)
      local gs = package.loaded.gitsigns

      local function map(mode, l, r, desc)
        vim.keymap.set(mode, l, r, { buffer = bufnr, desc = desc })
      end

      -- Navigation
      map("n", "]h", gs.next_hunk, "Next Hunk")
      map("n", "[h", gs.prev_hunk, "Prev Hunk")

      -- Actions
      map("n", "<leader>hs", gs.stage_hunk, "Stage hunk")
      map("n", "<leader>hr", gs.reset_hunk, "Reset hunk")
      map("v", "<leader>hs", function()
        gs.stage_hunk({ vim.fn.line("."), vim.fn.line("v") })
      end, "Stage hunk")
      map("v", "<leader>hr", function()
        gs.reset_hunk({ vim.fn.line("."), vim.fn.line("v") })
      end, "Reset hunk")

      map("n", "<leader>hS", gs.stage_buffer, "Stage buffer")
      map("n", "<leader>hR", gs.reset_buffer, "Reset buffer")

      map("n", "<leader>hu", gs.undo_stage_hunk, "Undo stage hunk")

      map("n", "<leader>hp", gs.preview_hunk, "Preview hunk")

      map("n", "<leader>hb", function()
        gs.blame_line({ full = true })
      end, "Blame line")
      map("n", "<leader>hB", gs.toggle_current_line_blame, "Toggle line blame")

      map("n", "<leader>hd", gs.diffthis, "Diff this")
      map("n", "<leader>hD", function()
        gs.diffthis("~")
      end, "Diff this ~")

      -- Text object
      map({ "o", "x" }, "ih", ":<C-U>Gitsigns select_hunk<CR>", "Gitsigns select hunk")
    end,
  },
}
```

### indent-blankline

Guías de indentación para Neovim.

```nvim
return {
  "lukas-reineke/indent-blankline.nvim",
  event = { "BufReadPre", "BufNewFile" },
  main = "ibl",
  opts = {
  --  indent = { char = "┊" },
		indent = {
			char = "│",
			tab_char = "│",
		},
	}
}
```

### init.lua

Al igual que con otros directorios, este no es un plugin, es solo el archivo de entrada que Lua busca en cada directorio.

```nvim
return {
  "nvim-lua/plenary.nvim", -- lua functions that many plugins use
  "christoomey/vim-tmux-navigator", -- tmux & split window navigation
}
```

### lazygit

Plugin para llamar a lazygit desde Neovim.

Para asegurarse de que esto funcione, instálelo primero usando brew:

```sh
brew install jesseduffield/lazygit/lazygit
```

```nvim
return {
  "kdheepak/lazygit.nvim",
  cmd = {
    "LazyGit",
    "LazyGitConfig",
    "LazyGitCurrentFile",
    "LazyGitFilter",
    "LazyGitFilterCurrentFile",
  },
  -- optional for floating window border decoration
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  -- setting the keybinding for LazyGit with 'keys' is recommended in
  -- order to load the plugin when the command is run for the first time
  keys = {
    { "<leader>lg", "<cmd>LazyGit<cr>", desc = "Open lazy git" },
  },
}
```

### linting

Un plugin linter asincrónico para Neovim complementario al soporte del Protocolo de servidor de lenguaje incorporado.

```nvim
return {
  "mfussenegger/nvim-lint",
  event = { "BufReadPre", "BufNewFile" },
  config = function()
    local lint = require("lint")

    lint.linters_by_ft = {
      go = { "golangcilint" },
      python = { "pylint" },
    }

    local lint_augroup = vim.api.nvim_create_augroup("lint", { clear = true })

    vim.api.nvim_create_autocmd({ "BufEnter", "BufWritePost", "InsertLeave" }, {
      group = lint_augroup,
      callback = function()
        lint.try_lint()
      end,
    })

    vim.keymap.set("n", "<leader>l", function()
      lint.try_lint()
    end, { desc = "Trigger linting for current file" })
  end,
}
```

### lualine

Un plugin de línea de estado de Neovim increíblemente rápido y fácil de configurar, escrito en lua puro.

```nvim
return {
  "nvim-lualine/lualine.nvim",
  dependencies = { "nvim-tree/nvim-web-devicons" },
  config = function()
    local lualine = require("lualine")

    local colors = {
      blue = "#65D1FF",
      green = "#3EFFDC",
      violet = "#FF61EF",
      yellow = "#FFDA7B",
      red = "#FF4A4A",
      fg = "#c3ccdc",
      bg = "#112638",
      inactive_bg = "#2c3043",
    }

    local my_lualine_theme = {
      normal = {
        a = { bg = colors.blue, fg = colors.bg, gui = "bold" },
        b = { bg = colors.bg, fg = colors.fg },
        c = { bg = colors.bg, fg = colors.fg },
      },
      insert = {
        a = { bg = colors.green, fg = colors.bg, gui = "bold" },
        b = { bg = colors.bg, fg = colors.fg },
        c = { bg = colors.bg, fg = colors.fg },
      },
      visual = {
        a = { bg = colors.violet, fg = colors.bg, gui = "bold" },
        b = { bg = colors.bg, fg = colors.fg },
        c = { bg = colors.bg, fg = colors.fg },
      },
      command = {
        a = { bg = colors.yellow, fg = colors.bg, gui = "bold" },
        b = { bg = colors.bg, fg = colors.fg },
        c = { bg = colors.bg, fg = colors.fg },
      },
      replace = {
        a = { bg = colors.red, fg = colors.bg, gui = "bold" },
        b = { bg = colors.bg, fg = colors.fg },
        c = { bg = colors.bg, fg = colors.fg },
      },
      inactive = {
        a = { bg = colors.inactive_bg, fg = colors.semilightgray, gui = "bold" },
        b = { bg = colors.inactive_bg, fg = colors.semilightgray },
        c = { bg = colors.inactive_bg, fg = colors.semilightgray },
      },
    }

    -- configure lualine with modified theme
    lualine.setup({
      options = {
        theme = my_lualine_theme,
      },
    })
  end,
}
```

### markdown-preview

Plugin de vista previa de Markdown para Neovim.

```nvim
return {
	"iamcco/markdown-preview.nvim",
	cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
	ft = { "markdown" },
	build = function()
		vim.fn["mkdp#util#install"]()
	end,
	config = function()
		local keymap = vim.keymap

		keymap.set("n", "<leader>mp", "<cmd>MarkdownPreview<cr>", { desc = "Markdown Preview" })
		keymap.set("n", "<leader>ms", "<cmd>MarkdownPreviewStop<cr>", { desc = "Markdown Preview Stop" })
		keymap.set("n", "<leader>mt", "<cmd>MarkdownPreviewToggle<cr>", { desc = "Markdown Preview Toggle" })
	end,
}
```

### mini

Plugin Lua de Neovim para visualizar y operar en el ámbito de sangría. Parte de la biblioteca 'mini.nvim'.

```nvim
return {
	"echasnovski/mini.indentscope",
	version = false,
	opts = {
		symbol	= "│",
	},
}
```

### nvim-cmp

Un plugin de completado para Neovim codificado en Lua.

```nvim
return {
  "hrsh7th/nvim-cmp",
  event = "InsertEnter",
  dependencies = {
    "hrsh7th/cmp-buffer", -- source for text in buffer
    "hrsh7th/cmp-path", -- source for file system paths
    {
      "L3MON4D3/LuaSnip",
      -- follow latest release.
      version = "v2.*", -- Replace <CurrentMajor> by the latest released major (first number of latest release)
      -- install jsregexp (optional!).
      build = "make install_jsregexp",
    },
    "saadparwaiz1/cmp_luasnip", -- for autocompletion
    "rafamadriz/friendly-snippets", -- useful snippets
    "onsails/lspkind.nvim", -- vs-code like pictograms
  },
  config = function()
    local cmp = require("cmp")

    local luasnip = require("luasnip")

    local lspkind = require("lspkind")

    -- loads vscode style snippets from installed plugins (e.g. friendly-snippets)
    require("luasnip.loaders.from_vscode").lazy_load()

    cmp.setup({
      completion = {
        completeopt = "menu,menuone,preview,noselect",
      },
      snippet = { -- configure how nvim-cmp interacts with snippet engine
        expand = function(args)
          luasnip.lsp_expand(args.body)
        end,
      },
      mapping = cmp.mapping.preset.insert({
        ["<C-k>"] = cmp.mapping.select_prev_item(), -- previous suggestion
        ["<C-j>"] = cmp.mapping.select_next_item(), -- next suggestion
        ["<C-b>"] = cmp.mapping.scroll_docs(-4),
        ["<C-f>"] = cmp.mapping.scroll_docs(4),
        ["<C-Space>"] = cmp.mapping.complete(), -- show completion suggestions
        ["<C-e>"] = cmp.mapping.abort(), -- close completion window
        ["<CR>"] = cmp.mapping.confirm({ select = false }),
      }),
      -- sources for autocompletion
      sources = cmp.config.sources({
				{ name = "nvim_lsp" }, -- lsp
        { name = "luasnip" }, -- snippets
        { name = "buffer" }, -- text within current buffer
        { name = "path" }, -- file system paths
      }),

      -- configure lspkind for vs-code like pictograms in completion menu
      formatting = {
        format = lspkind.cmp_format({
          maxwidth = 50,
          ellipsis_char = "...",
        }),
      },
    })
  end,
}
```

### nvim-tree

Un árbol explorador de archivos para Neovim escrito en lua.

```nvim
return {
  "nvim-tree/nvim-tree.lua",
  dependencies = "nvim-tree/nvim-web-devicons",
  config = function()
    local nvimtree = require("nvim-tree")

    -- recommended settings from nvim-tree documentation
    vim.g.loaded_netrw = 1
    vim.g.loaded_netrwPlugin = 1

    nvimtree.setup({
      view = {
        width = 35,
        relativenumber = true,
      },
      -- change folder arrow icons
      renderer = {
        indent_markers = {
          enable = true,
        },
        icons = {
          glyphs = {
            folder = {
              arrow_closed = "", -- arrow when folder is closed
              arrow_open = "", -- arrow when folder is open
            },
          },
        },
      },
      -- disable window_picker for
      -- explorer to work well with
      -- window splits
      actions = {
        open_file = {
          window_picker = {
            enable = false,
          },
        },
      },
      filters = {
        custom = { ".DS_Store" },
      },
      git = {
        ignore = false,
      },
    })

    -- set keymaps
    local keymap = vim.keymap

    keymap.set("n", "<leader>ee", "<cmd>NvimTreeToggle<CR>", { desc = "Toggle file explorer" }) -- toggle file explorer
    keymap.set("n", "<leader>ef", "<cmd>NvimTreeFindFileToggle<CR>", { desc = "Toggle file explorer on current file" }) -- toggle file explorer on current file
    keymap.set("n", "<leader>ec", "<cmd>NvimTreeCollapse<CR>", { desc = "Collapse file explorer" }) -- collapse file explorer
    keymap.set("n", "<leader>er", "<cmd>NvimTreeRefresh<CR>", { desc = "Refresh file explorer" }) -- refresh file explorer
  end
}
```

### surround

Agregue/cambie/elimine pares delimitadores circundantes con facilidad.

```nvim
return {
  "kylechui/nvim-surround",
  event = { "BufReadPre", "BufNewFile" },
  version = "*", -- Use for stability; omit to use `main` branch for the latest features
  config = true,
}
```

### telescope

Un fuzzy finder de listas que ofrece las siguientes opciones: Buscar, Filtrar, Vista previa, Seleccionar.

```nvim
return {
  "nvim-telescope/telescope.nvim",
  branch = "0.1.x",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-tree/nvim-web-devicons",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")

    telescope.setup({
      defaults = {
        path_display = { "smart" },
        mappings = {
          i = {
            ["<C-k>"] = actions.move_selection_previous, -- move to prev result
            ["<C-j>"] = actions.move_selection_next, -- move to next result
            ["<C-q>"] = actions.send_selected_to_qflist + actions.open_qflist, -- send selected items to quickfix list
          },
        },
      },
    })

    telescope.load_extension("fzf")

    -- set keymaps
    local keymap = vim.keymap

    keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>", { desc = "Fuzzy find files in cwd" })
    keymap.set("n", "<leader>fr", "<cmd>Telescope oldfiles<cr>", { desc = "Fuzzy find recent files" })
    keymap.set("n", "<leader>fs", "<cmd>Telescope live_grep<cr>", { desc = "Find string in cwd" })
    keymap.set("n", "<leader>fc", "<cmd>Telescope grep_string<cr>", { desc = "Find string under cursor in cwd" })
  end,
}
```

### todo-comments

Resalte, enumere y busque comentarios de "TODOs" en sus proyectos.

```nvim
return {
  "folke/todo-comments.nvim",
  event = { "BufReadPre", "BufNewFile" },
  dependencies = { "nvim-lua/plenary.nvim" },
  config = function()
    local todo_comments = require("todo-comments")

    -- set keymaps
    local keymap = vim.keymap -- for conciseness

    keymap.set("n", "]t", function()
      todo_comments.jump_next()
    end, { desc = "Next todo comment" })

    keymap.set("n", "[t", function()
      todo_comments.jump_prev()
    end, { desc = "Previous todo comment" })

    todo_comments.setup()
  end,
}
```

### treesitter

Plugin de resaltado.

A continuación, se muestran los idiomas que más utilizo como antes, con una configuración adicional para usar con [templ](https://github.com/a-h/templ).

```nvim
return {
	"nvim-treesitter/nvim-treesitter",
	event = { "BufReadPre", "BufNewFile" },
	build = ":TSUpdate",
	dependencies = {
		"windwp/nvim-ts-autotag",
		"vrischmann/tree-sitter-templ",
	},
	config = function()
		vim.treesitter.language.register("templ", "templ")

		local treesitter = require("nvim-treesitter.configs")

		-- configure treesitter
		treesitter.setup({
			highlight = {
				enable = true,
			},
			indent = { enable = true },
			autotag = {
				enable = true,
			},
			ensure_installed = {
				"json",
				"yaml",
				"html",
				"css",
				"go",
				"templ",
				"markdown",
				"markdown_inline",
				"bash",
				"lua",
				"vim",
				"dockerfile",
				"gitignore",
				"query",
				"vimdoc",
				"dart",
				"python",
			},
			incremental_selection = {
				enable = true,
				keymaps = {
					init_selection = "<C-space>",
					node_incremental = "<C-space>",
					scope_incremental = false,
					node_decremental = "<bs>",
				},
			},
		})
	end,
}
```

### trouble

Una bonita lista de diagnósticos, referencias, resultados de telescopios, soluciones rápidas y ubicaciones para ayudarlo a resolver todos los problemas que su código está causando.

```nvim
return {
  "folke/trouble.nvim",
  dependencies = { "nvim-tree/nvim-web-devicons", "folke/todo-comments.nvim" },
  keys = {
    { "<leader>xx", "<cmd>TroubleToggle<CR>", desc = "Open/close trouble list" },
    { "<leader>xw", "<cmd>TroubleToggle workspace_diagnostics<CR>", desc = "Open trouble workspace diagnostics" },
    { "<leader>xd", "<cmd>TroubleToggle document_diagnostics<CR>", desc = "Open trouble document diagnostics" },
    { "<leader>xq", "<cmd>TroubleToggle quickfix<CR>", desc = "Open trouble quickfix list" },
    { "<leader>xl", "<cmd>TroubleToggle loclist<CR>", desc = "Open trouble location list" },
    { "<leader>xt", "<cmd>TodoTrouble<CR>", desc = "Open todos in trouble" },
  },
}
```

### vim-maximizer

Maximiza y restaura la ventana actual en Vim.

```nvim
return {
  "szw/vim-maximizer",
  keys = {
    { "<leader>sm", "<cmd>MaximizerToggle<CR>", desc = "Maximize/minimize a split" },
  },
}
```

### which-key

Le ayuda a recordar las combinaciones de teclas de Neovim, mostrando las combinaciones de teclas disponibles en una ventana emergente mientras escribe.

```nvim
return {
  "folke/which-key.nvim",
  event = "VeryLazy",
  init = function()
    vim.o.timeout = true
    vim.o.timeoutlen = 500
  end,
  opts = {},
}
```

## Conclusión

Si has llegado hasta aquí, enhorabuena porque la lista, como puedes ver, es bastante extensa.

Como ya sabrás, la lista de plugins para Neovim es tremendamente enorme y a veces nos puede generar ansiedad y dudas sobre cómo podemos empezar y qué plugins nos pueden ayudar.

Espero que con esta lista mía y la configuración lista para usar que te he dejado, puedas tener un punto de partida y empezar a crear tu propio editor a tu gusto poco a poco hasta llegar a la configuración perfecta para ti.

Si tienes plugins que no has visto en mi lista y que crees que son interesantes para que los pruebe, por favor compártelos conmigo ya que siempre me gusta descubrir y probar cosas nuevas, te lo agradecería mucho.

Espero que todo lo que he intentado explicar en este post haya quedado claro, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera, déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantada de responderte.

Feliz programación!

{C3P}
