.PHONY:  kac node-version i ri gen-tsr-routes setup dev

NODE_VERSION = 22.15.1
NVM_SETUP = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use $(NODE_VERSION)

# Kit and Caboodle ############################################################
# ^^ ?? 👉 https://www.youtube.com/watch?v=xvFZjo5PgG0
kac: ri gen-tsr-routes setup dev

# Node Version Management #####################################################
node-version:
	@echo "Current Node version: $(shell node -v)"
	@echo "Required Node version: v$(NODE_VERSION)"
	@if [ "$(shell node -v)" != "v$(NODE_VERSION)" ]; then \
		echo "Switching to correct version..."; \
		$(NVM_SETUP) && node -v; \
	else \
		echo "Already using correct Node version"; \
	fi

# Package Management ###########################################################
i: 
	$(NVM_SETUP) && npm install

ri: 
	rm -rf node_modules package-lock.json
	$(MAKE) i

# Workflows ###################################################################
gen-tsr-routes:
	$(NVM_SETUP) && npm run tanstackrouter:generate:routes

setup: 
	$(NVM_SETUP) && npm run db:setup

dev:
	$(NVM_SETUP) && npm run dev