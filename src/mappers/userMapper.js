const departments = [
    'Frontend',
    'Backend',
    'Testing',
    'Full Stack',
    'UI/UX',
];

export const mapUserToEmployee = (user) => {
    return{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company?.name ?? '',
        department: departments[(user.id - 1) % departments.length],
        status: user.id % 2 === 0 ? "Active" : "Inactive",
        salary: 30000 + user.id * 5000,
        startDate: new Date(
        2020,
        (user.id - 1) % 12,
        ((user.id - 1) % 28) + 1
        )
        .toISOString()
        .split("T")[0],
        location: `City ${user.id}`,
        initials: user.name
        .trim()
        .split(/\s+/)
        .map((namePart) => namePart[0])
        .join("")
        .toUpperCase(),
    };
}
