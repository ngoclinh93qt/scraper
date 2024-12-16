### To build and start

NOTE: check your chip Architecture. my dockerfile running nodejs for chip ARM, if your chip is not ARM you can remove the config `--platform=linux/arm64` in `scraped-backend/Dockerfile` 
`in backend-scraped/ copy the .env.example to the .env`

```shell
./start.sh
```

to migration data

```shell
./migration.sh
```

example:

for single url and static contents:

```shell
curl --location 'localhost:3000/urls' \
--header 'Authorization: Bearer yyy' \
--header 'Content-Type: application/json' \
--data '{
    "urls": ["https://dev.to/eastrittmatter/1d-polynomial-curve-fitting-in-numpy-and-matplotlib-2560"]
}'
```

for multiple url and dynamic content:
go to the `localhost:3001/upload` and upload the example file in this root directory, after that you can back to home and see the result

go to browser and brows `localhost:3001`
