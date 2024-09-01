import { Component } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
  animations: [
    trigger("fadeIn", [
      state("void", style({ opacity: 0 })),
      transition(":enter", [animate("0.5s", style({ opacity: 1 }))]),
    ]),
    trigger("cardAnimation", [
      state("void", style({ transform: "translateY(-20px)", opacity: 0 })),
      transition(":enter", [
        animate("0.5s", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class GameComponent {
  public leftCard: any;
  public rightCard: any;
  public winner: string = "";
  leftScore = 0;
  rightScore = 0;
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
      this.determineWinner(this.resourceType);
    });
  }

  determineWinner(resource: string): void {
    const leftMass = parseInt(this.leftCard.mass, 10);
    const rightMass = parseInt(this.rightCard.mass, 10);

    const leftCrew = parseInt(this.leftCard.crew, 10);
    const rightCrew = parseInt(this.rightCard.crew, 10);

    switch (resource) {
      case "people":
        this.winner = this.compareMass(leftMass, rightMass);
        this.updateScore(this.winner);
        break;
      case "starships":
        this.winner = this.compareMass(leftCrew, rightCrew);
        this.updateScore(this.winner);
        break;
      default:
        break;
    }
  }

  compareMass(value1: number, value2: number): string {
    if (value1 > value2) {
      return "Left Player";
    } else if (value1 < value2) {
      return "Right Player";
    } else {
      return "Draw";
    }
  }

  updateScore(winner: string): void {
    if (winner === "Left Player") {
      this.leftScore++;
    } else if (winner === "Right Player") {
      this.rightScore++;
    }
  }

  changeResourceType(type: "people" | "starships"): void {
    this.resourceType = type;
    console.log(type, "type");
  }
}
