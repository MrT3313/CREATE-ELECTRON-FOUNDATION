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
	npm unlink
	@echo "Symlink '$(command)' should now be unlinked."
	@echo "Run 'make check-link' or 'which create-electron-foundation' to verify (it should ideally not be found, or report an error)."

check-link:
	@echo "-----------------------------------------------------"
	@echo "Checking symlink status for '$(command)':"
	@echo "Attempting to locate symlink at /Users/mrt/.nvm/versions/node/v20.17.0/bin/$(command)"
	@if [ -L "/Users/mrt/.nvm/versions/node/v20.17.0/bin/$(command)" ]; then \
		echo "> Symlink found at absolute path."; \
		echo "Details:"; \
		ls -l /Users/mrt/.nvm/versions/node/v20.17.0/bin/create-electron-foundation; \
	else \
		echo "> Symlink NOT found at /Users/mrt/.nvm/versions/node/v20.17.0/bin/$(command)"; \
		echo "Fallback: Checking 'which $(command)' (PATH check)..."; \
		which $(command) || echo "> '$(command)' not found in PATH via 'which'"; \
	fi
	@echo "-----------------------------------------------------"

# TESTING #####################################################################
batch-test:
	cd TEST && ./batch.test.sh