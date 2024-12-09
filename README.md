### To build and start

```shell
./start.sh
```

to migration data

```shell
./migration.sh
```

example:

```shell
curl --location 'localhost:3000/urls' \
--header 'Authorization: Bearer yyy' \
--header 'Content-Type: application/json' \
--data '{
    "urls": ["https://dev.to/eastrittmatter/1d-polynomial-curve-fitting-in-numpy-and-matplotlib-2560"]
}'
```

go to browser and brows `localhost:3001`
