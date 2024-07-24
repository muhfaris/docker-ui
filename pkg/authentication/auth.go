package authentication

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/oklog/ulid/v2"
)

var secretKey = []byte(ulid.Make().String())

func init() {
	secret := os.Getenv("SECRET_KEY")
	if secret != "" {
		secretKey = []byte(secret)
	}
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type OptionsClaim struct {
	Username string
}

func WithUsername(username string) func(*OptionsClaim) {
	return func(opts *OptionsClaim) {
		opts.Username = username
	}
}

func New(opts ...func(*OptionsClaim)) *Claims {
	var options OptionsClaim

	for _, opt := range opts {
		opt(&options)
	}

	return &Claims{Username: options.Username}
}

// GenerateJWT generates a JWT token
func (c *Claims) GenerateJWT() (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: c.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// ValidateJWT validates a JWT token
func (c *Claims) ValidateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return nil, fmt.Errorf("invalid token signature")
		}
		return nil, fmt.Errorf("could not parse token: %v", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
