<p align="center">
  <img src="https://github.com/ridemountainpig/monkeytype-readme/assets/92412722/c384384f-bb60-496c-998e-65c2b8d3e161" style="width:550px;"/>
</p>

# MonkeyType Readme

Monkeytype Readme transforms MonkeyType typing data into SVGs for your GitHub Readme.

  <a href="https://monkeytype.com/profile/miodec">
   <img src="https://raw.githubusercontent.com/ridemountainpig/monkeytype-readme/monkeytype-readme/monkeytype-readme-Miodec.svg" alt="My Monkeytype profile" />
  </a>
  
## Usage

To use MonkeyType Readme for your GitHub Readme, follow these steps:

1. Add a `monkeytype-readme.yml` file in your repository's `.github/workflows/` path.
2.  Configure `monkeytype-readme.yml` with the following format:
    
    > Note: change YOUR_USERNAME to your MonkeyType username.
    
    > Note: This workflow will auto to update your MonkeyType Readme.
    
    #### Themes
    Change `THEMES` to your favorite theme in MonkeyType.<br/>
    If theme name have `space`, please change `space` to `_`.<br/>
    > Example: `nord light` => `nord_light`
    
    #### SVGs information
    
    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/ridemountainpig/monkeytype-readme/monkeytype-readme/monkeytype-readme.svg" alt="My Monkeytype profile" />
    </a>
  
    #### With LeaderBoards: `?lb=true`
    
    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/ridemountainpig/monkeytype-readme/monkeytype-readme/monkeytype-readme-lb.svg" alt="My Monkeytype profile" />
    </a>  
  
    #### With PersonalBests: `?pb=true`
    
    <a href="https://monkeytype.com/profile/rocket">
      <img src="https://raw.githubusercontent.com/ridemountainpig/monkeytype-readme/monkeytype-readme/monkeytype-readme-pb.svg" alt="My Monkeytype profile" />
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
              node-version: '16.x'

          - name: Download SVG
            run: |
              mkdir public
              curl -o public/monkeytype-readme.svg https://monkeytype-readme.repl.co/generate-svg/YOUR_USERNAME/THEMES
              curl -o public/monkeytype-readme-lb.svg https://monkeytype-readme.repl.co/generate-svg/YOUR_USERNAME/THEMES?lb=true
              curl -o public/monkeytype-readme-pb.svg https://monkeytype-readme.repl.co/generate-svg/YOUR_USERNAME/THEMES?pb=true
              curl -o public/monkeytype-readme-lb-pb.svg https://monkeytype-readme.repl.co/generate-svg/YOUR_USERNAME/THEMES?lbpb=true

          - name: push monkeytype-readme.svg to the monkeytype-readme branch
            uses: crazy-max/ghaction-github-pages@v2.5.0
            with:
              target_branch: monkeytype-readme
              build_dir: public
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```
    
3. Create `monkeytype-readme` branch in your repository's.
4. Add SVGs to your GitHub Readme.

   > Note: </br>
   > change YOUR_USERNAME to your MonkeyType username.</br>
   > change YOUR_REPOSITORY to your repository name.
   
   ```md
    <a href="https://monkeytype.com/profile/YOUR_USERNAME">
      <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPOSITORY/monkeytype-readme/monkeytype-readme-lb.svg" alt="My Monkeytype profile" />
    </a>
   ```

4. Go to actions and run `generate monkeytype readme svg` workflow.

5. Done! Your MonkeyType Readme will show on your Readme.

## Running Locally

To run MonkeyType Readme locally, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/ridemountainpig/monkeytype-readme.git
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
