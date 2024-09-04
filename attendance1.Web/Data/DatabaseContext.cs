using System.Data.SqlClient;
using System.Data;

namespace attendance1.Web.Data
{
    public class DatabaseContext
    {
        private readonly string _connectionString;

        public DatabaseContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public string ConnectionString => _connectionString;

        //read and return table
        //public DataTable ExecuteQuery(string query, SqlParameter[] parameters)
        //{
        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(_connectionString))
        //        {
        //            SqlCommand command = new SqlCommand(query, connection);
        //            if (parameters != null)
        //            {
        //                command.Parameters.AddRange(parameters);
        //            }
        //            SqlDataAdapter adapter = new SqlDataAdapter(command);

        //            DataTable resultTable = new DataTable();
        //            adapter.Fill(resultTable);

        //            return resultTable;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return new DataTable();
        //    }

        //}


        //edit table and return row affected
        //public int ExecuteNonQuery(string query, Dictionary<string, object> parameters)
        //{
        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(_connectionString))
        //        {
        //            SqlCommand command = new SqlCommand(query, connection);
        //            foreach (var param in parameters)
        //            {
        //                command.Parameters.AddWithValue(param.Key, param.Value);
        //            }
        //            connection.Open();
        //            return command.ExecuteNonQuery();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return -1;
        //    }
        //}



        #region with transaction and connection
        public async Task<DataTable?> ExecuteQueryAsync(string query, SqlParameter[] parameters, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddRange(parameters);
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataTable result = new DataTable();
                        adapter.Fill(result);
                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<int> ExecuteNonQueryAsync(string query, Dictionary<string, object> parameters, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    foreach (var param in parameters)
                    {
                        command.Parameters.AddWithValue(param.Key, param.Value);
                    }
                    return await command.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
            }
        }

        public async Task<int> ExecuteScalarAsync<T>(string query, SqlParameter[] parameters, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddRange(parameters);
                    var result = await command.ExecuteScalarAsync();
                    if (result != null)
                    {
                        return (int)result;
                    }
                    return 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
                //throw;
            }
        }

        //public async Task<T> ExecuteInTransactionAsync<T>(Func<SqlConnection, SqlTransaction, Task<T>> operation)
        //{
        //    using (SqlConnection connection = new SqlConnection(_connectionString))
        //    {
        //        await connection.OpenAsync();
        //        using (SqlTransaction transaction = connection.BeginTransaction())
        //        {
        //            try
        //            {
        //                var result = await operation(connection, transaction);
        //                try
        //                {
        //                    transaction.Commit();
        //                }
        //                catch (Exception ex)
        //                {
        //                    Console.WriteLine(ex.Message);   
        //                }

        //                //transaction.Commit();
        //                return result;
        //            }
        //            catch
        //            {
        //                transaction.Rollback();
        //                throw;
        //            }
        //        }
        //    }
        //}

        public async Task<T> ExecuteInTransactionAsync<T>(Func<SqlConnection, SqlTransaction, Task<T>> operation)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var result = await operation(connection, transaction);
                        transaction.Commit();
                        return result;
                    }
                    catch (Exception ex)
                    {
                        // Log or handle the exception here
                        Console.WriteLine($"Error in transaction: {ex.Message}");
                        throw; // Rethrow the exception to be handled by the caller
                    }
                }
            }
        }
        #endregion

        #region without transaction and connection
        public async Task<DataTable?> ExecuteQueryAsync(string query, SqlParameter[] parameters)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddRange(parameters);
                        await connection.OpenAsync();
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable result = new DataTable();
                            adapter.Fill(result);
                            return result;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<int> ExecuteNonQueryAsync(string query, Dictionary<string, object> parameters)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    SqlCommand command = new SqlCommand(query, connection);
                    foreach (var param in parameters)
                    {
                        command.Parameters.AddWithValue(param.Key, param.Value);
                    }
                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
            }
        }

        public async Task<int> ExecuteScalarAsync<T>(string query, SqlParameter[] parameters)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddRange(parameters);
                        await connection.OpenAsync();
                        var result = await command.ExecuteScalarAsync();
                        if (result != null)
                        {
                            return (int)result;
                        }
                        return 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
            }
        }
        #endregion

    }
}
