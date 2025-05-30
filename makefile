phony: i ri

i:
	npm install
ri:
	rm -rf node_modules package-lock.json
	make i