
# GitHub Stats Collector

This project is a Next.js application designed to collect statistics about the programming languages used in your GitHub repositories and store this data in a MongoDB database using Prisma ORM. The application features dynamic routing to display the total lines of code for each programming language across all your repositories. You can use this project to get Github stats and display them in your portfolio.

## Features

- Fetches data from the GitHub API for your repositories.
- Collects lines of code (LOC) data for each repository using the CodeTabs API.
- Stores aggregated LOC data in a MongoDB database.
- Dynamic API routes to retrieve LOC data for specific programming languages.

## Technologies Used

- Next.js
- Prisma ORM
- MongoDB
- GitHub API
- CodeTabs API

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/NithinChowdaryRavuri/my-github-stats.git
   cd my-github-stats
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root directory and add your environment variables:

   ```env
   DATABASE_URL="your_mongodb_connection_string"
   ```

4. Generate Prisma client:

   ```sh
   npx prisma generate
   ```

5. Run the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

### Main API Endpoint

This endpoint fetches and stores the LOC data for all repositories.

```ts
GET /api/index
```

### Dynamic Language Endpoint

This endpoint retrieves the total LOC for a specific programming language.

```ts
GET /api/[language]
```

#### Example

To get the LOC for JavaScript:

```sh
GET /api/javascript
```

## Code Overview

### Main API Endpoint (`/api/index`)

This endpoint performs the following steps:

1. Fetches repositories from the GitHub API.
2. Collects LOC data for each repository using the CodeTabs API with a delay to avoid rate limiting.
3. Aggregates LOC data for specific programming languages.
4. Updates the single document in the `LanguageData` collection in MongoDB with the aggregated data.

### Note:
The API endpoint takes a long time to compute due to the delay. If you host it using Netlify or other free providers, you will encounter a timeout error. Currently, I'm running it on my local machine to avoid this issue. I'm considering using AWS Lambda to resolve this, but I would appreciate your thoughts on the matter.

### Dynamic Language Endpoint (`/api/[language]`)

This endpoint retrieves the total LOC for a specific programming language from the MongoDB database.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [GitHub API](https://docs.github.com/en/rest)
- [CodeTabs API](https://codetabs.com/)

## Author

Nithin Chowdary Ravuri
