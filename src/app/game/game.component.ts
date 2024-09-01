import { Component } from '@angular/core';
import { SwapiService } from '../services/swapi.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  public leftCard: any;
  public rightCard: any;
  public winner: string = '';

  constructor(private swapiService: SwapiService) {}

  startGame() {
    this.winner = ''; // restart
    this.fetchRandomCards();
  }

  fetchRandomCards() {
    this.swapiService.getRandomPerson().subscribe((person1) => {
      this.leftCard = person1.result.properties;

      this.swapiService.getRandomPerson().subscribe((person2) => {
        this.rightCard = person2.result.properties;

        this.determineWinner();
      });
    });
  }

  determineWinner() {
    const mass1 = parseInt(this.leftCard.mass);
    const mass2 = parseInt(this.rightCard.mass);

    if (mass1 > mass2) {
      this.winner = 'Left';
    } else if (mass1 < mass2) {
      this.winner = 'Right';
    } else {
      this.winner = 'Draw';
    }
  }
}
