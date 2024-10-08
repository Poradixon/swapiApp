import { Component } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Card } from "../interfaces/card.interface";


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
    trigger("fadeOut", [
      state("visible", style({ opacity: 1 })),
      transition("visible => void", [animate("0.5s", style({ opacity: 0 }))]),
    ]),
  ],
})
export class GameComponent {
  public leftCard: Card | null = null;
  public rightCard: Card | null = null;
  winner: string | null = null;
  leftScore = 0;
  rightScore = 0;
  resourceType: "people" | "starships" = "people";
  cardsVisible = true;
  cardsLoaded = false;

  constructor(private swapiService: SwapiService) {}

  startGame(): void {
    this.winner = null;
    this.cardsVisible = false;
    this.fetchCards();
  }

  fetchCards(): void {
    const fetchLeftCard$ = this.swapiService.getResource(this.resourceType);
    const fetchRightCard$ = this.swapiService.getResource(this.resourceType);

    fetchLeftCard$.subscribe((leftResource) => {
      this.leftCard = leftResource.result.properties;
    });

    fetchRightCard$.subscribe((rightResource) => {
      this.rightCard = rightResource.result.properties;
      if (this.leftCard) {
        this.cardsVisible = true;
        this.cardsLoaded = true;
        this.determineWinner(this.resourceType);
      }
    });
  }

  determineWinner(resource: string): void {
    if (this.leftCard && this.rightCard) {
      switch (resource) {
        case "people":
          const leftMass = this.parseNumber(this.leftCard.mass);
          const rightMass = this.parseNumber(this.rightCard.mass);
          this.winner = this.compareValue(leftMass, rightMass);
          this.updateScore(this.winner);
          break;
        case "starships":
          const leftCrew = this.parseNumber(this.leftCard.crew);
          const rightCrew = this.parseNumber(this.rightCard.crew);
          this.winner = this.compareValue(leftCrew, rightCrew);
          this.updateScore(this.winner);
          break;
        default:
          break;
      }
    }
  }

  compareValue(value1: number, value2: number): string {
    if (value1 > value2) {
      return "Left Player";
    } else if (value1 < value2) {
      return "Right Player";
    } else if (isNaN(value1) || isNaN(value2)) {
      return "Cannot compare due to unknown values";
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
  }

  private parseNumber(value: string): number {
    return parseInt(value.replace(",", ""), 10);
  }
}
