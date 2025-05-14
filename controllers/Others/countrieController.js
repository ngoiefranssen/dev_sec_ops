const { Op } = require("sequelize");
const countrieModel = require("../../db/models/Others/countrieModel");

const findAllElementNationalite = async (req, res) => {
  try {
    // Validation des paramètres de requête
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    if (isNaN(rows) || isNaN(first)) {
      return res
        .status(400)
        .json({
          message: "Les paramètres 'rows' et 'first' doivent être des nombres.",
        });
    }

    let order = [];
    if (sortField) {
      if (!["ASC", "DESC"].includes(sortOrder)) {
        return res
          .status(400)
          .json({
            message: "Le paramètre 'sortOrder' doit être 'ASC' ou 'DESC'.",
          });
      }
      order = [[sortField, sortOrder === "1" ? "ASC" : "DESC"]];
    }

    const globalSearchColumns = ["name", "code_iso", "description"];
    let searchConditions = [];
    if (search && search.trim() !== "") {
      globalSearchColumns.forEach((column) => {
        searchConditions.push({ [column]: { [Op.substring]: search } });
      });
    }

    const whereCondition =
      searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

    const { count, rows: countries } = await countrieModel.findAndCountAll({
      attributes: ["id_countrie", "name", "code_iso", "description"],
      where: {
        ...whereCondition,
      },
      order,
      limit: parseInt(rows, 10),
      offset: parseInt(first, 10),
    });

    res.status(200).json({
      message: "La visualisation a été réalisée avec succès",
      countries,
      totalRecords: count,
    });
  } catch (error) {
    // Gestion des erreurs avec des messages détaillés
    console.error("Erreur lors de la récupération des nationalités:", error);
    res
      .status(500)
      .json({ message: "Erreur interne du serveur", error: error.message });
  }
};

module.exports = {
  findAllElementNationalite,
};
