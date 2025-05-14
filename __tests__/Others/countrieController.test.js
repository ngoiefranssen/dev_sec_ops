const { findAllElementNationalite } = require("../../controllers/Others/countrieController");
const countrieModel = require("../../db/models/Others/countrieModel");

jest.mock("../../db/models/Others/countrieModel");

describe("findAllElementNationalite", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        rows: "10",
        first: "0",
        sortField: "name",
        sortOrder: "1",
        search: ""
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });
    
//   it("doit retourner un succès avec les données filtrées", async () => {
//     const mockData = {
//       count: 2,
//       countries: [
//         { id_countrie: 1, name: "RDcongo", code_iso: "CDF", description: "Pays africain" },
//         { id_countrie: 2, name: "Australie", code_iso: "AUD", description: "Pays asiatique" },
//       ],
//     };

//     countrieModel.findAndCountAll.mockResolvedValue(mockData);

//     await findAllElementNationalite(req, res);

//     expect(countrieModel.findAndCountAll).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "La visualisation a été réalisée avec succès",
//       countries: mockData.rows,
//       totalRecords: mockData.count,
//     });
//   });

  it("doit retourner une erreur 400 si 'rows' ou 'first' ne sont pas des nombres", async () => {
    req.query.rows = "abc";

    await findAllElementNationalite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Les paramètres 'rows' et 'first' doivent être des nombres.",
    });
  });

  it("doit retourner une erreur 400 si sortOrder est invalide", async () => {
    req.query.sortOrder = "invalid";

    await findAllElementNationalite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Le paramètre 'sortOrder' doit être 'ASC' ou 'DESC'.",
    });
  });

  const { Op } = require("sequelize");

// it("doit appliquer la recherche si 'search' est fourni", async () => {
//   req.query.search = "fra";

//   const mockData = {
//     count: 4,
//     rows: [
//       { id_countrie: 1, name: "RD.Congo", code_iso: "CDF", description: "Nationalité Congolaise" },
//       { id_countrie: 2, name: "Allemande", code_iso: "DEU", description: "Nationalité allemande" },
//       { id_countrie: 3, name: "Américaine", code_iso: "USA", description: "Nationalité américaine" },
//       { id_countrie: 4, name: "Japonaise", code_iso: "JPN", description: "Nationalité japonaise" },
//     ],
//   };

//   countrieModel.findAndCountAll.mockResolvedValue(mockData);

//   await findAllElementNationalite(req, res);

//   expect(countrieModel.findAndCountAll).toHaveBeenCalledWith(
//     expect.objectContaining({
//       where: expect.objectContaining({
//         [Op.or]: expect.arrayContaining([
//           expect.objectContaining({ name: expect.any(Object) }),
//           expect.objectContaining({ code_iso: expect.any(Object) }),
//           expect.objectContaining({ description: expect.any(Object) }),
//         ]),
//       }),
//     })
//   );

//   expect(res.status).toHaveBeenCalledWith(200);
//   expect(res.json).toHaveBeenCalledWith({ 
//     message: "La visualisation a été réalisée avec succès",
//     countries: mockData.rows,
//     totalRecords: mockData.count,
//   });
// });


//   it("doit retourner une erreur 500 en cas d'exception", async () => {
//     countrieModel.findAndCountAll.mockRejectedValue(new Error("DB Error"));

//     await findAllElementNationalite(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Erreur interne du serveur",
//       error: "DB Error",
//     });
//   });
});
