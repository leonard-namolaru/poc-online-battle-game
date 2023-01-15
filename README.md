# POCA 2023

## Group

- Pocamon
- YYY
- ZZZ

## Prerequisite

- Install Node.js
- Install Yarn
- Install Docker

## API Installation

- clone this repo locally
- run `cd apps/api` to go to API folder
- run `yarn install` to install all dependencies
- run `yarn db:start` to start postgres DB
- run `yarn db:migrate` to set up DB
- run `yarn dev` to start developing

## API Testing

To run tests, you simply need to run `yarn test`

## API Deployment

To prepare a build for deployment, you need to run `yarn build`.
All compilation assets are located in `/dist`.

After deploying `/dist`, you simply need to run `yarn start`