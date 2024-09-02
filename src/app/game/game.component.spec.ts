import { GameComponent } from "./game.component";
import { SwapiService } from "../services/swapi.service";
import { of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Card } from "../interfaces/card.interface";

const mockLeftCard: Card = {
  name: "Luke Skywalker",
  mass: "77",
  crew: "1",
};

const mockRightCard: Card = {
  name: "Darth Vader",
  mass: "136",
  crew: "1",
};

describe("GameComponent", () => {
  let component: GameComponent;
  let mockSwapiService: jasmine.SpyObj<SwapiService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockSwapiService = jasmine.createSpyObj("SwapiService", ["getResource"]);
    mockSnackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);

    component = new GameComponent(mockSwapiService);

    mockSwapiService.getResource.and.returnValues(
      of({ result: { properties: mockLeftCard } }),
      of({ result: { properties: mockRightCard } })
    );
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch cards and determine winner based on mass", () => {
    component.startGame();

    expect(component.leftCard).toEqual(mockLeftCard);
    expect(component.rightCard).toEqual(mockRightCard);

    component.determineWinner("people");

    expect(component.winner).toBe("Right Player");
  });

  it("should fetch cards and determine winner based on crew", () => {
    component.startGame();

    expect(component.leftCard).toEqual(mockLeftCard);
    expect(component.rightCard).toEqual(mockRightCard);

    component.determineWinner("starships");

    expect(component.winner).toBe("Draw");
  });

  it("should handle unknown values and notify user", () => {
    const unknownCard: Card = {
      name: "Unknown",
      mass: "unknown",
      crew: "unknown",
    };

    mockSwapiService.getResource.and.returnValues(
      of({ result: { properties: unknownCard } }),
      of({ result: { properties: mockRightCard } })
    );

    component.startGame();

    expect(component.leftCard).toEqual(unknownCard);
    expect(component.rightCard).toEqual(mockRightCard);

    component.determineWinner("people");

    expect(component.winner).toBe("Cannot compare due to unknown values");
  });

  it("should update scores correctly", () => {
    component.updateScore("Left Player");
    expect(component.leftScore).toBe(1);
    expect(component.rightScore).toBe(0);

    component.updateScore("Right Player");
    expect(component.leftScore).toBe(1);
    expect(component.rightScore).toBe(1);

    component.updateScore("Draw");
    expect(component.leftScore).toBe(1);
    expect(component.rightScore).toBe(1);
  });

  it("should parse numbers correctly", () => {
    expect(component["parseNumber"]("1,000")).toBe(1000);
    expect(component["parseNumber"]("123")).toBe(123);
    expect(component["parseNumber"]("unknown")).toBeNaN();
  });
});
