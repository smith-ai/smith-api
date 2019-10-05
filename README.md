# smith-api

smith-api is the core Express API that powers the Mr Smith virtual assistant. All invocations from any interfaces are processed and handled by this API.

## Installation

Mr Smith uses [GitHub Package Registry](https://github.com/features/package-registry) for hosting its custom modules, which are built as NPM packages.
Currently, GitHub Package Registry requires all users to authenticate via a personal access token for installing packages.
Therefore, you will first need to [generate a GitHub personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line), and add this to a `.env` file.

Once added, you can then just build and run the necessary Docker containers via docker-compose:

```bash
docker-compose up -d
```