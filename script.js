import { createTask, updateTask, deleteTask, loadTasks, saveTasks } from './js/task.js';
import { openTaskModal } from './js/modal.js';

const taskAreaContainer = document.getElementById( 'taskAreaContainer' );
const createTaskBtn = document.getElementById( 'createTaskBtn' );

let tasks = [];

document.addEventListener( 'DOMContentLoaded', () => {
    tasks = loadTasks();
    renderTasks( tasks );
} );

export function renderTasks( tasks ) {
    const taskAreas = {
        Profissional: [],
        Pessoal: [],
        Acadêmica: []
    };

    const today = new Date().setHours(0, 0, 0, 0); // Get today's date without time

    tasks.forEach( task => {

        const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0); // Get task's due date without time
        let vencimentoHTML = '';

        if (dueDate < today) {
            vencimentoHTML = '<span class="vencimento-indicator vencido"></span>';
        }


        const formattedDueDate = new Date(task.dueDate).toLocaleDateString('pt-BR');

        const taskTitle = task.status === 'encerrada' ? `<del>${task.title}</del>` : task.title;
        const taskCardHTML = `
            <div class="task-card" data-task-id="${task.id}">
                <h3>${taskTitle}</h3>
                <p>Término: ${formattedDueDate}</p>
                ${vencimentoHTML}
                <span class="prioridade-indicator ${task.priority}"></span> 
                <button class="open-task-modal-btn">Abrir</button>
                <button class="edit-task-btn">Editar</button>
                <button class="delete-task-btn">Deletar</button>
            </div>
        `;
        taskAreas[ task.area ].push( taskCardHTML );
    } );

    for ( const area in taskAreas ) {
        const areaDiv = document.querySelector( `.task-area[data-area="${area}"]` );
        areaDiv.innerHTML = `<h2>${area}</h2>`;

        if ( taskAreas[ area ].length > 0 ) {
            taskAreas[ area ].forEach( taskHTML => {
                areaDiv.innerHTML += taskHTML;
            } );
        } else {
            areaDiv.innerHTML += '<p>Sem tarefas por enquanto.</p>';
        }
    }

    const openTaskButtons = document.querySelectorAll( '.open-task-modal-btn' );
    const editTaskButtons = document.querySelectorAll( '.edit-task-btn' );
    const deleteTaskButtons = document.querySelectorAll( '.delete-task-btn' );

    openTaskButtons.forEach( button => {
        button.addEventListener( 'click', ( event ) => {
            const taskCard = event.target.closest( '.task-card' );
            const taskId = taskCard.dataset.taskId;
            const taskToView = tasks.find( task => task.id === taskId );
            openTaskModal( tasks, taskToView, 'view' );
        } );
    } );

    editTaskButtons.forEach( button => {
        button.addEventListener( 'click', ( event ) => {
            const taskCard = event.target.closest( '.task-card' );
            const taskId = taskCard.dataset.taskId;
            const taskToUpdate = tasks.find( task => task.id === taskId );
            openTaskModal( tasks, taskToUpdate, 'edit' );
        } );
    } );

    deleteTaskButtons.forEach( button => {
        button.addEventListener( 'click', ( event ) => {
            const taskCard = event.target.closest( '.task-card' );
            const taskId = taskCard.dataset.taskId;
            if ( confirm( 'Certeza que quer deletar?' ) ) {
                tasks = deleteTask( tasks, taskId );
                saveTasks(tasks);
                renderTasks( tasks );
                location.reload();
            }
        } );
    } );
}

createTaskBtn.addEventListener( 'click', () => {
    openTaskModal( tasks, {}, 'create' );
} );