import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];


  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  add(name): void {
    name = name.trim();
    if (!name) { return; }
    let h = new Hero(name);
    this.heroService.addHero(h)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(id: string): void {
    this.heroService.deleteHero(id).subscribe(o => {
      let index = this.heroes.findIndex(elem => elem._id === id);
      this.heroes.splice(index, 1);
    });
  }
}
