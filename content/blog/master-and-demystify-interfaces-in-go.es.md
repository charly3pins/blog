+++
title = "Domina y desmitifica las interfaces en Go"
date = "2024-04-29"
author = "charly3pins"
description = "Descubre cómo aprovechar al máximo las interfaces para crear código flexible y modular."
draft = true

tags = ["go"]

image = "/images/gopher-nerdy.png"
+++

---

## **POST EN CONSTRUCCIÓN**

---

```go
package main

import (
	"fmt"
	"log"
	"math/rand"
)

type Player interface {
	Attack() int
	Stats() string
	GetDamage(int)
	IsDeath() bool
}

type Knight struct {
	Name      string
	Power     int
	Hitpoints int
}

func newKnight() *Knight {
	return &Knight{
		Name:      fmt.Sprintf("Elite Knight %d", rand.Intn(999)),
		Power:     rand.Intn(60),
		Hitpoints: rand.Intn(100),
	}
}

func (k Knight) Attack() int {
	return k.Power
}

func (k Knight) Stats() string {
	return fmt.Sprintf("%s HP:[%d]", k.Name, k.Hitpoints)
}

func (k *Knight) GetDamage(damage int) {
	k.Hitpoints -= damage
}

func (k Knight) IsDeath() bool {
	return k.Hitpoints <= 0
}

type Paladin struct {
	Name      string
	Power     int
	Distance  int
	Hitpoints int
}

func newPaladin() *Paladin {
	return &Paladin{
		Name:      fmt.Sprintf("Royal Paladin %d", rand.Intn(999)),
		Power:     rand.Intn(75),
		Distance:  rand.Intn(10),
		Hitpoints: rand.Intn(50),
	}
}

func (p Paladin) Attack() int {
	return p.Power + p.Distance
}

func (p Paladin) Stats() string {
	return fmt.Sprintf("%s HP:[%d]", p.Name, p.Hitpoints)
}

func (p *Paladin) GetDamage(damage int) {
	p.Hitpoints -= damage
}

func (p Paladin) IsDeath() bool {
	return p.Hitpoints <= 0
}

type Demon struct {
	Hitpoints int
}

func (Demon) Attack() int {
	if rand.Intn(2) > 0 {
		return 10
	}
	return 0
}

func main() {
	players := []Player{
		newKnight(),
		newKnight(),
		newKnight(),
		newPaladin(),
		newPaladin(),
		newPaladin(),
	}

	demon := Demon{Hitpoints: 999}

	for _, player := range players {
		fmt.Printf("%s has a Power:[%d]\n", player.Stats(), player.Attack())
		for {
			demon.Hitpoints = demon.Hitpoints - player.Attack()
			if demon.Hitpoints <= 0 {
				log.Printf("Demon defeated by %s\n", player.Stats())
				return
			}
			player.GetDamage(demon.Attack())
			if player.IsDeath() {
				log.Printf("%s death", player.Stats())
				break
			}
		}
	}
	log.Println("Demon won with HP:", demon.Hitpoints)
}
```

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantado de responderte.
