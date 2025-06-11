.PHONY: i ri build link unlink check-link

# PACKAGE MANAGEMENT ##########################################################
i:
	npm install
ri:
	rm -rf node_modules package-lock.json
	make i

# BUILDING ####################################################################
build:
	@echo "Cleaning old build directory..."
	@rm -rf dist
	npm run build
	@echo "Making cli/dist/index.js executable..."
	@chmod +x cli/dist/index.js

# LINTING & FORMATTING
laf:
	npm run lint
	npm run format

# PUBLISHING ##################################################################
pack:
	npm pack

dry-run:
	npm publish --dry-run

PUBLISH_TAG=alpha
publish:
	@if [ "$$(git branch --show-current)" != "main" ]; then \
		echo "Error: publish can only be run on the main branch"; \
		exit 1; \
	fi
	npm publish --tag $(PUBLISH_TAG)

# SYMLINK MANAGEMENT ##########################################################
command=create-electron-foundation

link: build
	@echo "Creating global symlink for create-electron-foundation..."
	npm link
	@echo "Symlink '$(command)' should now be linked globally."
	@echo "Run 'make check-link' or 'which create-electron-foundation' to verify."

unlink:
	@echo "Removing global symlink for create-electron-foundation..."
	npm unlink $(command)
	@echo "Symlink '$(command)' should now be unlinked."
	@echo "Run 'make check-link' or 'which create-electron-foundation' to verify (it should ideally not be found, or report an error)."

check-link:
	@echo "-----------------------------------------------------"
	@echo "Checking symlink status for '$(command)':"
	@if command -v $(command) >/dev/null 2>&1; then \
		echo "✅ '$(command)' is in your PATH at: $$(which $(command))"; \
		echo "   It links to: $$(readlink $$(which $(command)))"; \
		echo "   The global package links to: $$(readlink $$(npm root -g)/$(command))"; \
	else \
		echo "❌ '$(command)' not found in your PATH."; \
	fi
	@echo "-----------------------------------------------------"

# TESTING #####################################################################
batch-test:
	cd TEST && ./batch.test.sh