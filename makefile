all:
	preview

.PHONY: deploy update preview

preview:
	gulp global_json
	gulp

# usage: make deploy m="commit message"
deploy:
	rm -rf published
	gulp global_json
	gulp preview
	git add .
	git commit -m "stage: $(m)" --allow-empty
	git pull
	git push
	make update

# Pushes the published folder to gh-pages to update the staging webpage.
update:
	git push origin `git subtree split --prefix published master`:gh-pages --force

