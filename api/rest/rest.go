package rest

import (
	"github.com/muhfaris/docker-ui/api/rest/routers"
)

func New(port string) {
	r := routers.New()
	r.Listen(port)
}
