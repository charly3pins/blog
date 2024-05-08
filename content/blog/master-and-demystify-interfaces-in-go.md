+++
title = "Master and demystify Interfaces in Go"
date = "2024-04-29"
author = "charly3pins"
description = "Discover how to make the most of interfaces to create flexible and modular code."

tags = ["go"]

image = "/images/gopher-nerdy.png"
+++

---

## **POST IN PROGRESS**

---

{{< youtube LjNv9nzp1dM >}}

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

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
