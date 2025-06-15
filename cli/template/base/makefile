.PHONY:  kac i ri gen-tsr-routes setup dev

# Get the node version from .nvmrc
NODE_VERSION := $(shell cat .nvmrc)

# ------------------------------------------------------------------------------
# macOS/nvm Compatibility Fix
#
# Problem:
# On macOS, if Node.js is installed via Homebrew, it can set a global
# `npm_config_prefix` environment variable. This variable conflicts with nvm
# (Node Version Manager), which this Makefile uses for Node version management.
# When nvm detects this variable, it throws an error and exits to prevent
# potential package corruption.
#
# Solution:
# This block conditionally prepares a command to `unset` the conflicting
# environment variable *only on macOS*.
#
# - `uname -s`: This command gets the name of the operating system kernel.
#   On macOS, it returns "Darwin".
# - `ifeq ... endif`: This is a makefile conditional. The code inside only runs
#   if the condition is met.
# - `UNSET_NPM_CONFIG_PREFIX`: We define a variable that is empty by default.
#   On Darwin systems, we set it to `unset npm_config_prefix &&`.
#
# This variable is then prepended to any command that uses `npm` or `nvm`,
# ensuring the conflict is resolved for that specific command without
# permanently altering the user's shell configuration.
# ------------------------------------------------------------------------------
UNSET_NPM_CONFIG_PREFIX :=
ifeq ($(shell uname -s),Darwin)
	UNSET_NPM_CONFIG_PREFIX := unset npm_config_prefix &&
endif

# Get current node version (if node is available)
CURRENT_NODE_VERSION := $(shell node -v 2>/dev/null || echo "none")

# Update the node version using nvm (with auto-install if needed)
NVM_SETUP = \
	export NVM_DIR="$$HOME/.nvm" && . "$$NVM_DIR/nvm.sh" && \
	echo "✅ nvm found, checking for Node.js v$(NODE_VERSION)..." && \
	if [ -z "$$(nvm ls $(NODE_VERSION) | grep 'N/A')" ]; then \
		echo "✅ Node.js v$(NODE_VERSION) is already installed"; \
	else \
		echo "📦 Node.js v$(NODE_VERSION) not found, installing..."; \
		nvm install $(NODE_VERSION); \
		echo "✅ Node.js v$(NODE_VERSION) installed successfully"; \
	fi && \
	echo "🔄 Switching to Node.js v$(NODE_VERSION)..." && \
	nvm use $(NODE_VERSION) && \
	echo "✅ Now using Node.js $$(node -v)"

# Check for nvm by looking for the nvm.sh script
NVM_CHECK := $(shell if [ -s "$(HOME)/.nvm/nvm.sh" ]; then echo "true"; fi)

# Smart node version management
NODE_MANAGE = \
	if [ "$(CURRENT_NODE_VERSION)" = "v$(NODE_VERSION)" ]; then \
		echo "✅ Already using correct Node.js version: $(CURRENT_NODE_VERSION)"; \
	elif [ "$(CURRENT_NODE_VERSION)" = "none" ]; then \
		echo "❌ Node.js not found on system"; \
		if [ -z "$(NVM_CHECK)" ]; then \
			echo "⚠️  Install Node.js v$(NODE_VERSION) or nvm to manage versions"; \
			exit 1; \
		else \
			$(NVM_SETUP); \
		fi; \
	elif [ -z "$(NVM_CHECK)" ]; then \
		echo "⚠️  Current Node.js: $(CURRENT_NODE_VERSION), Required: v$(NODE_VERSION)"; \
		echo "⚠️  nvm not detected - cannot switch versions automatically"; \
		echo "⚠️  You may encounter errors with the wrong Node.js version"; \
	else \
		echo "🔄 Current Node.js: $(CURRENT_NODE_VERSION), switching to v$(NODE_VERSION)..."; \
		$(NVM_SETUP); \
	fi

# Kit and Caboodle ############################################################
# ^^ ?? 👉 https://www.youtube.com/watch?v=xvFZjo5PgG0
kac: ri gen-tsr-routes setup dev

# Package Management ###########################################################
i:
	@$(UNSET_NPM_CONFIG_PREFIX)$(NODE_MANAGE) && npm install

ri:
	rm -rf node_modules package-lock.json
	$(MAKE) i

# Workflows ###################################################################
gen-tsr-routes:
	@$(UNSET_NPM_CONFIG_PREFIX)$(NODE_MANAGE) && npm run tanstackrouter:generate:routes

setup:
	@$(UNSET_NPM_CONFIG_PREFIX)$(NODE_MANAGE) && npm run db:setup

dev:
	@if [ -d "node_modules" ]; then \
		echo "Starting development server..."; \
		@$(UNSET_NPM_CONFIG_PREFIX)$(NODE_MANAGE) && npm run dev; \
	else \
		echo "node_modules not found. Running install first..."; \
		$(MAKE) ri; \
		$(MAKE) dev; \
	fi