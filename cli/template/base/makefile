.PHONY: i ri setup dev node-version

NODE_VERSION = 22.15.1
NVM_SETUP = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && nvm use $(NODE_VERSION)

node-version:
	@echo "Current Node version: $(shell node -v)"
	@echo "Required Node version: v$(NODE_VERSION)"
	@if [ "$(shell node -v)" != "v$(NODE_VERSION)" ]; then \
		echo "Switching to correct version..."; \
		$(NVM_SETUP) && node -v; \
	else \
		echo "Already using correct Node version"; \
	fi

i: 
	@$(NVM_SETUP) && npm install

ri: 
	rm -rf node_modules package-lock.json
	$(MAKE) i

setup: 
	@$(NVM_SETUP) && npm run setup

dev: 
	@$(NVM_SETUP) && npm run dev

