build:
	uglifyjs src/monitor.js -o build/monitor.min.js --source-map build/monitor.min.js.map -c

.PHONY: build
