import { Component } from '@angular/core';
import { SwapiService } from '../services/swapi.service';

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  public leftCard: any;
  public rightCard: any;
  public winner: string = "";
  resourceType: "people" | "starships" = "people";

  constructor(private swapiService: SwapiService) {}

  startGame() {
    this.winner = ""; // restart
    this.fetchCards();
  }

  fetchCards() {
    this.swapiService.getResource(this.resourceType).subscribe((resource) => {
      this.leftCard = resource.result.properties;
    });

    this.swapiService.getResource(this.resourceType).subscribe((resource) => {
      this.rightCard = resource.result.properties;
      this.determineWinner();
    });
  }

  determineWinner() {
    const mass1 = parseInt(this.leftCard.mass);
    const mass2 = parseInt(this.rightCard.mass);

    if (mass1 > mass2) {
      this.winner = "Left";
    } else if (mass1 < mass2) {
      this.winner = "Right";
    } else {
      this.winner = "Draw";
    }
  }

  changeResourceType(type: "people" | "starships"): void {
    this.resourceType = type;
    console.log(type, "type");
  }
}
