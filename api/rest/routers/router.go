package routers

import (
	"os"
	"os/signal"

	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/api/rest/routers/handlers"
	"github.com/muhfaris/docker-ui/api/rest/routers/middlewares"
)

type Router struct {
	fiber   *fiber.App
	handler *handlers.Handler
}

func New() *Router {
	handler, err := handlers.New()
	if err != nil {
		return nil
	}

	api := &Router{
		fiber: fiber.New(
			fiber.Config{
				EnablePrintRoutes: true,
			},
		),
		handler: handler,
	}

	api.initialize()

	return api
}

func (r *Router) initialize() {
	var apiGroup = r.fiber.Group("/api")
	apiGroup.Post("/login", r.handler.Login())

	var dockerGroup = apiGroup.Group("/dockers")
	dockerGroup.Use(middlewares.Authentication())

	var serviceGroup = dockerGroup.Group("/services")
	r.servicesRouter(serviceGroup)
}

func (r *Router) servicesRouter(router fiber.Router) {
	router.Get("", r.handler.DockerListServices())
	router.Patch("", r.handler.DockerUpdateServices())
}

func (r *Router) Listen(port string) {
	go r.fiber.Listen(port)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	err := r.fiber.Shutdown()
	if err != nil {
		return
	}
}
