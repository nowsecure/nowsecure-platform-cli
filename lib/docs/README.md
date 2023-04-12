# HTML Documentation generation

Documents are generated using [Slate](https://github.com/slatedocs/slate) via their [docker image](https://hub.docker.com/r/slatedocs/slate). <br/>
[makedocs.sh](./makedocs.sh) builds the input for Slate & runs the docker image.

Some of the input files have been modified to support a [deeper level of nesting](https://github.com/slatedocs/slate/wiki/Deeper-Nesting) than Slate supports out of the box<br/>
These changes will need to be ported when moving to a newer version of Slate

- Copy the directories `/srv/slate/source` and `/srv/slate/source` from the new docker image to the [slate/original](./slate/original) directory
- Remove `source/index.html.md` and `source/includes`
- Reapply the changes & save the modified files in [slate/modified](./slate/modified)
- Update the docker image tag in [makedocs.sh](./makedocs.sh)
