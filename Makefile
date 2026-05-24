## Run dev server. Usage: 'make run'
run: ; $(info Starting astro dev server...)
	bun run dev

## Build production site
build: ; $(info Building site...)
	bun run build
