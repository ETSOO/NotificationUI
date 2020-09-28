import React from 'react';
import { NotificationDisplay } from '../src/NotificationDisplay';
import { NotificationReact } from '../src/NotificationReact';
import {
    NotificationContainer,
    NotificationType,
    NotificationAlign
} from '@etsoo/notificationbase';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';

// Class implementation for tests
class NotificationReactTest extends NotificationReact {
    /**
     * Render method
     * @param className Style class name
     */
    render(className?: string) {
        return (
            <div key={this.id} className={className}>
                {this.open ? this.content : ''}
            </div>
        );
    }
}

// Timer mock
// https://jestjs.io/docs/en/timer-mocks
jest.useFakeTimers();

// Test notification display component
const displayUI = (
    <NotificationDisplay
        createContainer={(align, children) => {
            return (
                <div
                    key={align}
                    className={NotificationAlign[align].toLowerCase()}
                >
                    {children}
                </div>
            );
        }}
        className="test"
        itemClassName="item"
    />
);

test('Tests for NotificationUI with enzyme', () => {
    // Arrange

    // Setup adapter
    Enzyme.configure({ adapter: new Adapter() });

    // Render the UI in the document
    const ui = mount(displayUI);
    const container = ui.find('div.test').first();

    // Align groups
    // Object.keys(Enum) will return string and number keys
    expect(container.children().length).toBe(
        Object.keys(NotificationAlign).length / 2
    );

    // Notification object
    const notification = new NotificationReactTest(
        NotificationType.Loading,
        'Loading...'
    );
    notification.timespan = 3;

    act(() => {
        // Add the notification
        NotificationContainer.add(notification);
    });

    // Unkown node
    const unkownDiv = container.find('div.unknown').first();

    // Node text
    expect(unkownDiv.text()).toBe('Loading...');

    act(() => {
        // Fast forward
        // Remove the child
        jest.runOnlyPendingTimers();
    });

    expect(unkownDiv.text()).toBe('');
    expect(NotificationContainer.alignCount(NotificationAlign.Unknown)).toBe(0);
});

jest.clearAllTimers();
