export default function decorate(block) {
    // Create the projects container
    const projectsContainer = document.createElement('div');
    projectsContainer.classList.add('project-insights-container');

    // Dummy data for project cards
    const projectsData = [
        {
            bugs: {
                total: 8,
                fixed: 5,
                remaining: 3,
            },
            skills: ["HTML", "CSS", "JavaScript", "EDS", "React"],
            currentSprint: {
                name: "Sprint 3",
                startDate: "Mar , 2025",
                endDate: "April 10, 2025",
            },
            progress: 70
        },
    ];

    // Define all functions within the decorate function
    function createSkillsPills(skills) {
        let pillsHTML = '';
        skills.forEach(skill => {
            pillsHTML += `<span class="skill-pill">${skill}</span>`;
        });
        
        return `
            <div class="skills-section">
                <div class="section-label">Tech Stack</div>
                <div class="skills-pills">
                    ${pillsHTML}
                </div>
            </div>
        `;
    }

    function createCurrentSprint(sprint) {
        return `
            <div class="sprint-section">
                <div class="section-label">Current Sprint</div>
                <div class="sprint-details">
                    <div class="sprint-name">${sprint.name}</div>
                    <div class="sprint-dates">${sprint.startDate} - ${sprint.endDate}</div>
                </div>
            </div>
        `;
    }

    function createBugsSection(bugs) {
        return `
            <div class="bugs-section">
                <div class="section-label">Bugs</div>
                <div class="bugs-cards">
                    <div class="bug-card total-bugs">
                        <div class="bug-card-title">Total Bugs</div>
                        <div class="bug-card-value">${bugs.total}</div>
                        <div class="card-background-image">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                    </div>
                    <div class="bug-card fixed-bugs">
                        <div class="bug-card-title">Fixed</div>
                        <div class="bug-card-value">${bugs.fixed}</div>
                        <div class="card-background-image">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="bug-card remaining-bugs">
                        <div class="bug-card-title">Remaining</div>
                        <div class="bug-card-value">${bugs.remaining}</div>
                        <div class="card-background-image">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card');
        
        // Use innerHTML to create the entire card content
        card.innerHTML = `
            ${createSkillsPills(project.skills)}
            ${createCurrentSprint(project.currentSprint)}
            <div class="progress-section">
                <div class="section-label">Progress</div>
                <div class="progress-value">${project.progress}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
            ${createBugsSection(project.bugs)}
        `;
        
        return card;
    }

    // Create project cards using innerHTML
    projectsData.forEach(project => {
        const card = createProjectCard(project);
        projectsContainer.appendChild(card);
    });

    // Replace block content with our projects container
    block.textContent = '';
    block.appendChild(projectsContainer);
} 