package cmd

import (
	"os"

	"github.com/muhfaris/docker-ui/api/rest"
	"github.com/spf13/cobra"
)

var restCmd = &cobra.Command{
	Use:   "rest",
	Short: "Rest API",
	Run: func(cmd *cobra.Command, args []string) {
		var defaultPort = ":2121"
		port := os.Getenv("PORT")
		if port == "" {
			port = defaultPort
		}

		rest.New(port)
	},
}

func Execute() {
	restCmd.Execute()
}
