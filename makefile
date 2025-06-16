.PHONY: i ri build laf version-patch version-minor version-major version pack dry-run publish-local link unlink check-link batch-test test

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

# LOCAL PUBLISHING (FOR TESTING) ##############################################
# Note: Official releases are handled by the 'Publish Package' GitHub Action.
# This is for local testing of the publish process only.
pack:
	npm pack
dry-run:
	npm publish --dry-run
PUBLISH_TAG=alpha
publish-local:
	@echo "WARNING: This is for local testing only."
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
test:
	@echo "Running tests for @create-electron-foundation/cli..."
	npm test -w @create-electron-foundation/cli

batch-test:
	cd TEST && ./batch.test.sh