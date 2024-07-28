package utils

import "strings"

func Contains(e string, s []string) bool {
	for _, a := range s {
		if strings.Contains(e, a) {
			return true
		}
	}
	return false
}
