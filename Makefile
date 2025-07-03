build:
	docker build --platform linux/amd64 -t khyliao/tutorez-api .
rmi:
	docker rmi khyliao/tutorez-api
run:
	docker run -d -p 8080:8080 --rm --name tutorez-api khyliao/tutorez-api
stop:
	docker stop tutorez-api
push: 
	docker push khyliao/tutorez-api