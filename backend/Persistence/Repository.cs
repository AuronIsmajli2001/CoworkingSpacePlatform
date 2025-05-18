using Application.Interfaces.Repository;
using Domain.Memberships;
using Microsoft.EntityFrameworkCore;
using Persistence.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Persistence.Repository
{
    public class Repository<Tentity> : IRepository<Tentity> where Tentity : class
    {
        private readonly DatabaseService _dbContext;

        public Repository(DatabaseService dbContext)
        {
            _dbContext = dbContext;
        }

        // Add these three methods to fix your error
        public async Task CreateAsync(Tentity entity)
        {
            await _dbContext.Set<Tentity>().AddAsync(entity);
        }

        public async Task CreateAsync(Membership membership)
        {
            await _dbContext.Set<Membership>().AddAsync(membership);
        }

        public IQueryable<Tentity> GetQuery()
        {
            return _dbContext.Set<Tentity>().AsQueryable();
        }

        // Keep all your existing methods below exactly as they are
        public void Create(Tentity entity)
        {
            _dbContext.Set<Tentity>().Add(entity);
        }

        public void CreateRange(List<Tentity> entities)
        {
            _dbContext.Set<Tentity>().AddRange(entities);
        }

        public void Delete(Tentity entity)
        {
            _dbContext.Set<Tentity>().Remove(entity);
        }

        public void DeleteRange(List<Tentity> entities)
        {
            _dbContext.Set<Tentity>().RemoveRange(entities);
        }

        public async Task<List<Tentity>> GetAllAsync()
        {
            return await _dbContext.Set<Tentity>().ToListAsync();
        }

        public IQueryable<Tentity> GetAll()
        {
            return _dbContext.Set<Tentity>();
        }

        public IQueryable<Tentity> GetByCondition(Expression<Func<Tentity, bool>> expression)
        {
            return _dbContext.Set<Tentity>().Where(expression);
        }

        public async Task<Tentity?> GetByIdAsync(int id)
        {
            return await _dbContext.Set<Tentity>().FindAsync(id);
        }

        public async Task<Tentity?> GetByIdAsync(string id)
        {
            return await _dbContext.Set<Tentity>().FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void Update(Tentity entity)
        {
            _dbContext.Set<Tentity>().Update(entity);
        }

        public void UpdateRange(List<Tentity> entities)
        {
            _dbContext.Set<Tentity>().UpdateRange(entities);
        }

        object IRepository<Tentity>.GetQuery()
        {
            return GetQuery();
        }
    }
}