<p align="center">
  <img src="https://github.com/monkeytype-hub/monkeytype-readme/assets/92412722/4491a4ef-f0e1-438d-84a4-c2205c33cd7e" style="width:1000px;"/>
</p>

# MonkeyType Readme

Monkeytype Readme transforms MonkeyType typing data into SVGs for your GitHub Readme.

  <a href="https://monkeytype.com/profile/miodec">
   <img src="https://raw.githubusercontent.com/monkeytype-hub/monkeytype-readme/monkeytype-readme/monkeytype-readme-Miodec.svg" alt="My Monkeytype profile" />
  </a>
  
## Usage

Two way to generate MonkeyType Readme

1. #### Using GitHub Action from Marketplace
2. #### Setting Up Custom MonkeyType Readme GitHub Action

### Using GitHub Action from Marketplace ([MonkeyType Readme Github Action](https://github.com/marketplace/actions/monkeytype-readme))

1. Add a `monkeytype-readme.yml` file in your repository's `.github/workflows/` path.
2. Configure `monkeytype-readme.yml` with the following format:

    - **Username**: Change `MONKEYTYPE_USERNAME` to your username in MonkeyType.

    - **Themes**: Change `MONKEYTYPE_THEME_NAME` to your favorite theme in MonkeyType.<br/>
      If theme name have `space`, please change `space` to `_`.<br/>

        > Example: `nord light` => `nord_light`

    - **Target Branch**: Change `BRANCH_NAME` to the branch you want to put MonkeyType Readme.

```yml
name: generate monkeytype readme svg

on:
    schedule:
        - cron: "0 */6 * * *" # every 6 hours
    workflow_dispatch:

jobs:
    download-svg:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Set up Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: "20.x"

            - name: Generate Monkeytype Readme SVG
              uses: monkeytype-hub/monkeytype-readme@v1.0.0
              with:
                  username: MONKEYTYPE_USERNAME
                  themes: MONKEYTYPE_THEME_NAME
                  target-branch: BRANCH_NAME
                  github-token: ${{ secrets.GITHUB_TOKEN }}
```

3. Go to actions and run `generate monkeytype readme svg` workflow.

4. Done! Now, navigate to your target branch and you'll find the MonkeyType README file. You can also integrate it into your GitHub README.

### Setting Up Custom MonkeyType Readme GitHub Action

1. Add a `monkeytype-readme.yml` file in your repository's `.github/workflows/` path.
2. Configure `monkeytype-readme.yml` with the following format:

    > Note: change YOUR_USERNAME to your MonkeyType username.

    > Note: This workflow will auto to update your MonkeyType Readme.

    #### Themes

    Change `THEMES` to your favorite theme in MonkeyType.<br/>
    If theme name have `space`, please change `space` to `_`.<br/>

    > Example: `nord light` => `nord_light`

    #### SVGs information

    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/monkeytype-hub/monkeytype-readme/monkeytype-readme/monkeytype-readme.svg" alt="My Monkeytype profile" />
    </a>

    #### With LeaderBoards: `?lb=true`

    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/monkeytype-hub/monkeytype-readme/monkeytype-readme/monkeytype-readme-lb.svg" alt="My Monkeytype profile" />
    </a>

    #### With PersonalBests: `?pb=true`

    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/monkeytype-hub/monkeytype-readme/monkeytype-readme/monkeytype-readme-pb.svg" alt="My Monkeytype profile" />
    </a>

    #### With LeaderBoards and PersonalBests: `?lbpb=true`

    #### github actions

    ```yml
    name: generate monkeytype readme svg

    on:
        schedule:
            - cron: "0 */6 * * *" # every 6 hours
        workflow_dispatch:

    jobs:
        download-svg:
            runs-on: ubuntu-latest
            steps:
                - name: Checkout code
                  uses: actions/checkout@v3

                - name: Set up Node.js
                  uses: actions/setup-node@v3
                  with:
                      node-version: "20.x"

                - name: Download SVG
                  run: |
                      mkdir public
                      curl -o public/monkeytype-readme.svg https://monkeytype-readme.zeabur.app/generate-svg/YOUR_USERNAME/THEMES
                      curl -o public/monkeytype-readme-lb.svg https://monkeytype-readme.zeabur.app/generate-svg/YOUR_USERNAME/THEMES?lb=true
                      curl -o public/monkeytype-readme-pb.svg https://monkeytype-readme.zeabur.app/generate-svg/YOUR_USERNAME/THEMES?pb=true
                      curl -o public/monkeytype-readme-lb-pb.svg https://monkeytype-readme.zeabur.app/generate-svg/YOUR_USERNAME/THEMES?lbpb=true

                - name: push monkeytype-readme.svg to the monkeytype-readme branch
                  uses: crazy-max/ghaction-github-pages@v4.0.0
                  with:
                      target_branch: monkeytype-readme
                      build_dir: public
                  env:
                      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```

3. Add SVGs to your GitHub Readme.

    > Note: </br>
    > change YOUR_MONKEYTYPE_USERNAME to your MonkeyType username.</br>
    > change YOUR_GITHUB_USERNAME to your Github username.</br>
    > change YOUR_GITHUB_REPOSITORY to your repository name.</br>
    > change SVG_NAME to the svg you want to use.</br>
    >
    > > original : monkeytype-readme.svg</br>
    > > original + leader boards : monkeytype-readme-lb.svg</br>
    > > original + personal bests : monkeytype-readme-pb.svg</br>
    > > original + leader boards + personal bests : monkeytype-readme-lbpb.svg

    ```md
     <a href="https://monkeytype.com/profile/YOUR_MONKEYTYPE_USERNAME">
       <img src="https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPOSITORY/monkeytype-readme/SVG_NAME" alt="My Monkeytype profile" />
     </a>
    ```

4. Go to actions and run `generate monkeytype readme svg` workflow.

5. Done! Your MonkeyType Readme will show on your Readme.

## Running Locally

To run MonkeyType Readme locally, follow these steps:

1. Clone this repository:

    ```bash
    git clone https://github.com/monkeytype-hub/monkeytype-readme.git
    ```

2. Store the MonkeyType APE keys in `.env`:

    ```bash
    cp .env.example .env
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Run the application:

    ```bash
    npm run dev
    ```

5. Finally, visit [http://localhost:3000](http://localhost:3000/) in your web browser.
