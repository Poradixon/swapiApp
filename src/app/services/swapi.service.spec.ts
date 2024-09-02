import { HttpClient } from "@angular/common/http";
import { of, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SwapiService } from "./swapi.service";

describe("SwapiService", () => {
  let service: SwapiService;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj("HttpClient", ["get"]);
    mockSnackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);

    service = new SwapiService(mockHttp, mockSnackBar);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getRandomId", () => {
    it("should return a specific ID when mocked", () => {
      spyOn<any>(service, "getRandomId").and.returnValue(5);

      const resource = "people";
      const mockResponse = { result: { properties: {} } };
      mockHttp.get.and.returnValue(of(mockResponse));

      service.getResource(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(mockHttp.get).toHaveBeenCalledWith(
        `https://www.swapi.tech/api/${resource}/5`
      );
    });
  });

  describe("retryRequest", () => {
    beforeEach(() => {
      spyOn<any>(service, "getRandomId").and.returnValue(1);
    });

    it("should handle a successful request", () => {
      const mockResponse = { result: { properties: {} } };
      const resource = "people";

      mockHttp.get.and.returnValue(of(mockResponse));

      service.getResource(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(mockHttp.get).toHaveBeenCalledWith(
        `https://www.swapi.tech/api/${resource}/1`
      );
    });

    it("should handle an error and display a snackbar", () => {
      const error = new ErrorEvent("Network error");
      const resource = "people";

      mockHttp.get.and.returnValue(throwError(() => error));

      service.getResource(resource).subscribe({
        error: () => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            "Request failed, please try again.",
            "Close",
            {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        },
      });

      expect(mockHttp.get).toHaveBeenCalledWith(
        `https://www.swapi.tech/api/${resource}/1`
      );
    });
  });

  describe("handleError", () => {
    it("should display an error message and return an observable with an error message", () => {
      const error = new ErrorEvent("Network error") as any;

      spyOn(console, "error");

      service["handleError"](error).subscribe({
        error: (err) => {
          expect(err).toBe("Something bad happened, please try again later.");
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            "Request failed, please try again.",
            "Close",
            {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        },
      });
    });
  });
});
