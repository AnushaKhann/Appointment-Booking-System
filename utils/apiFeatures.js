class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // The Mongoose query (e.g., ServiceProvider.find())
    this.queryString = queryString; // The query string from Express (req.query)
  }

  filter() {
    // 1A) Basic Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Normalize bracket-style query params (e.g. price[lt]=800)
    // into nested objects so the later operator replacement works whether
    // Express parsed queries as { 'price[lt]': '800' } or { price: { lt: '800' } }.
    const normalized = {};
    for (const key in queryObj) {
      const bracketMatch = key.match(/(.+)\[(.+)\]$/); // e.g. ['price[lt]','price','lt']
      if (bracketMatch) {
        const field = bracketMatch[1];
        const op = bracketMatch[2];
        if (!normalized[field]) normalized[field] = {};
        normalized[field][op] = queryObj[key];
      } else {
        normalized[key] = queryObj[key];
      }
    }

    // 1B) Advanced Filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(normalized);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // 1C) Parse the string back into an object
    let parsedQuery = JSON.parse(queryStr);

    // 1D) NEW: Manually convert number values
    // This is a more robust way to handle number conversion
    // It will find any value that is a string-number and convert it.
    const convertNumericValues = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertNumericValues(obj[key]); // Recurse for nested objects
        } else if (
          typeof obj[key] === 'string' &&
          !isNaN(obj[key]) &&
          !isNaN(parseFloat(obj[key])) &&
          obj[key].trim() !== '' // Don't convert empty strings
        ) {
          // Check if it's a string, is a number, and parses to a valid number
          obj[key] = parseFloat(obj[key]);
        }
      }
    };

    convertNumericValues(parsedQuery);

    this.query = this.query.find(parsedQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;