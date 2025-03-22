using System.Linq.Expressions;

namespace Application.Interfaces.Repository
{
    public interface IRepository<Tentity> where Tentity : class
    {
        void Create(Tentity entity);
        void CreateRange(List<Tentity> entities);
        void Delete(Tentity entity);
        void DeleteRange(List<Tentity> entities);
        IQueryable<Tentity> GetAll();
        IQueryable<Tentity> GetByCondition(Expression<Func<Tentity, bool>> expression);
        IQueryable<Tentity> GetById<Tkey>(Tkey id); // Use async for fetching by id
        Task SaveChangesAsync();
        void Update(Tentity entity);
        void UpdateRange(List<Tentity> entities);
    }
}