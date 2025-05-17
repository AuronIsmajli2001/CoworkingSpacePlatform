using Application.Interfaces.IUnitOfWork;
using Application.Interfaces.Repository;
using Persistence.Database;
using Persistence.Repository;
using Domain.Users;
using System.Collections;
using Domain.Memberships;

namespace Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseService _dbContext;
        private Hashtable _repositories;

        public UnitOfWork(DatabaseService dbContext)
        {
            _dbContext = dbContext;
        }

        public IRepository<User> Users => Repository<User>();
        public IRepository<Membership> Memberships => Repository<Membership>();

        public async Task<bool> CompleteAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public IRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            if (_repositories == null)
                _repositories = new Hashtable();

            var type = typeof(TEntity).Name;

            if (!_repositories.Contains(type))
            {
                var repositoryType = typeof(Repository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _dbContext);
                _repositories.Add(type, repositoryInstance);
            }

            return (IRepository<TEntity>)_repositories[type];
        }


    }
}
