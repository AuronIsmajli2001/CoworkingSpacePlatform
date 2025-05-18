// Persistence/UnitOfWork.cs
using Application.Interfaces;
using Application.Interfaces.IUnitOfWork;
using Application.Interfaces.Repository;
using Domain.Memberships;
using Domain.Users;
using Persistence.Database;
using Persistence.Repository;
using System;
using System.Collections;
using System.Threading.Tasks;

namespace Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseService _context;
        private Hashtable _repositories;

        public UnitOfWork(DatabaseService context)
        {
            _context = context;
            _repositories = new Hashtable();
        }

        // Specific repository properties
        public IRepository<User> Users => GetRepository<User>();
        public IRepository<Membership> Memberships => GetRepository<Membership>();

        // Generic repository access
        public IRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            return GetRepository<TEntity>();
        }

        private IRepository<TEntity> GetRepository<TEntity>() where TEntity : class
        {
            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(Repository<>);
                var repositoryInstance = Activator.CreateInstance(
                    repositoryType.MakeGenericType(typeof(TEntity)), _context);

                _repositories.Add(type, repositoryInstance);
            }

            return (IRepository<TEntity>)_repositories[type];
        }

        // Transaction methods
        public async Task<bool> CompleteAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}