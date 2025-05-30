﻿using System.Linq.Expressions;

namespace Application.Interfaces.Repository
{
    public interface IRepository<Tentity> where Tentity : class
    {
        Task<Tentity?> GetByIdAsync(string id);
        Task<List<Tentity>> GetAllAsync();
        IQueryable<Tentity> GetAll();
        IQueryable<Tentity> GetByCondition(Expression<Func<Tentity, bool>> expression);

        void Create(Tentity entity);
        void CreateRange(List<Tentity> entities);
        void Update(Tentity entity);
        void UpdateRange(List<Tentity> entities);
        void Delete(Tentity entity);
        void DeleteRange(List<Tentity> entities);
        Task SaveChangesAsync();
    }
}