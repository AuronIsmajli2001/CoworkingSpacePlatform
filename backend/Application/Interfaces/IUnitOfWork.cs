using Application.Interfaces.Repository;
using Domain.Users; // <-- add this if missing

namespace Application.Interfaces.IUnitOfWork
{
    public interface IUnitOfWork
    {
        IRepository<User> Users { get; } // <-- ADD THIS LINE
        IRepository<TEntity> Repository<TEntity>() where TEntity : class;
        Task<bool> CompleteAsync();
    }
}
