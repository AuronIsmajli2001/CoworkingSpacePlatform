using Application.Interfaces.Repository;
using Domain.Users; // <-- add this if missing
using Domain.Memberships;

namespace Application.Interfaces.IUnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<User> Users { get; } // <-- ADD THIS LINE
        IRepository<Membership> Memberships { get; } // <-- ADD THIS LINE
        IRepository<TEntity> Repository<TEntity>() where TEntity : class;
        Task<bool> CompleteAsync();
        Task CommitAsync();
    }
}
