/**
 * Database abstraction layer for Cloudflare D1
 * Provides helper methods to simplify working with D1 API
 */

export class Database {
  constructor(d1Instance) {
    this.db = d1Instance;
  }

  /**
   * Execute a query that returns a single row
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind
   * @returns {Promise<Object|null>} First row or null
   */
  async queryFirst(sql, params = []) {
    const result = await this.db.prepare(sql).bind(...params).first();
    return result;
  }

  /**
   * Execute a query that returns all matching rows
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind
   * @returns {Promise<Array>} Array of rows
   */
  async queryAll(sql, params = []) {
    const { results } = await this.db.prepare(sql).bind(...params).all();
    return results;
  }

  /**
   * Execute an INSERT/UPDATE/DELETE query
   * @param {string} sql - SQL query with ? placeholders
   * @param {Array} params - Parameters to bind
   * @returns {Promise<Object>} Result with meta information (last_row_id, changes, etc.)
   */
  async execute(sql, params = []) {
    const result = await this.db.prepare(sql).bind(...params).run();
    return result;
  }

  /**
   * Execute INSERT and return the inserted row
   * Workaround for D1's lack of RETURNING clause support
   * @param {string} sql - INSERT query with ? placeholders
   * @param {Array} params - Parameters to bind
   * @param {string} tableName - Table name for fetching inserted row
   * @returns {Promise<Object>} Inserted row
   */
  async insertAndReturn(sql, params = [], tableName) {
    const result = await this.execute(sql, params);
    const lastId = result.meta.last_row_id;

    // Fetch the inserted row using last_row_id
    const insertedRow = await this.queryFirst(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [lastId]
    );

    return insertedRow;
  }
}
