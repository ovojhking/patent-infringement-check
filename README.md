# Patent Infringement Check App

Given the patentID and companyName, compare patents.json and company_products.json to filter out the two entries with the highest risk level and generate an evaluation report.

This project uses **OpenAI** to analyze and generate the evaluation report and uses **fuzzy search** to find keywords, improving error tolerance for inputs.

Note 1: This project is **dockerized**, allowing for one-click environment deployment after setting the OpenAI token.

Note 2: The app allows saving a single analysis report, which can be accessed on the search page.


## How to use

1. To run the application, you’ll need an OpenAI API token, which you can obtain from the [Official Website](https://openai.com/index/openai-api/).


2. Clone the repository from GitHub:

```bash
git clone https://github.com/ovojhking/patent-infringement-check.git
```

3. Copy .env.copy
Navigate to the backend folder. Then copy .env.copy and rename it to .env.
Edit OPENAI_API_KEY={YOUR_API_KEY} within the file.

4. Return to the project's root directory and run docker compose up -d

```bash
cd ..
docker compose up -d
```

The app will then be run at [http://localhost:3000](http://localhost:3000).